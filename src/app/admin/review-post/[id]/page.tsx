'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import AuthorProfile from '../../../../components/AuthorProfile';
import { SkeletonPage, Spinner } from '../../../../components/Skeletons';
import { API_BASE_URL, resolveMediaUrl } from '../../../../lib/api';
import {
  authHeaders,
  clearAuthSession,
  getAuthToken,
  getRoleDashboardPath,
  getStoredUser,
} from '../../../../lib/auth';
import {
  BBC_MAIN_CATEGORIES,
  BBC_PLACEMENTS,
  BBC_SUBCATEGORIES_BY_MAIN,
  getSubcategoriesForMain,
} from '../../../../data/editorialConfig';
import { AuthUser, EditorialPost } from '../../../../types';

function parseStringArray(val: unknown): string[] {
  if (Array.isArray(val)) {
    return val.map((item) => String(item).trim()).filter(Boolean);
  }
  if (typeof val === 'string') {
    const trimmed = val.trim();
    if (!trimmed) return [];
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) {
        return parsed.map((item) => String(item).trim()).filter(Boolean);
      }
    } catch {
      return trimmed
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
    }
  }
  return [];
}

function extractFirstImageSrc(html: string): string {
  if (!html) return '';
  const match = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  return match?.[1] ? match[1].trim() : '';
}

function slugPreview(title: string): string {
  const clean = (title || 'your-bbc-headline-preview')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
  return clean || 'your-bbc-headline-preview';
}

export default function AdminReviewPostPage() {
  const router = useRouter();
  const params = useParams();
  const rawId = typeof params?.id === 'string' ? decodeURIComponent(params.id) : '';

  const [authChecked, setAuthChecked] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loadingPost, setLoadingPost] = useState(true);
  const [loadError, setLoadError] = useState('');

  const [postId, setPostId] = useState(rawId);
  const [postStatus, setPostStatus] = useState<EditorialPost['status']>('pending');
  const [postSlug, setPostSlug] = useState('');

  // Author info for preview / attribution
  const [authorInfo, setAuthorInfo] = useState<{
    id?: number | null;
    name: string;
    email?: string | null;
    bio?: string | null;
    photo?: string | null;
    linkedin?: string | null;
  }>({ name: 'BBC News Staff' });

  // Editorial fields
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [editorHtml, setEditorHtml] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [mainCategory, setMainCategory] = useState<string>(BBC_MAIN_CATEGORIES[0]);
  const [selectedSubCats, setSelectedSubCats] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [readDuration, setReadDuration] = useState<string>('5');
  const [placement, setPlacement] = useState<string>('archive');

  // SEO fields
  const [cardSummary, setCardSummary] = useState('');
  const [focusKeyword, setFocusKeyword] = useState('');
  const [metaDescription, setMetaDescription] = useState('');

  // UI state
  const [sidebarTab, setSidebarTab] = useState<'DETAILS' | 'SEO'>('DETAILS');
  const [subCatSearch, setSubCatSearch] = useState('');
  const [showAllSubCats, setShowAllSubCats] = useState(false);
  const [isPreview, setIsPreview] = useState(false);
  const [isProcessing, setIsProcessing] = useState<'publish' | 'reject' | null>(null);
  const [bannerMessage, setBannerMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  // Reject modal state
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  // Editor & media refs
  const editorRef = useRef<HTMLDivElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const modalImageInputRef = useRef<HTMLInputElement>(null);

  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [modalImageUrl, setModalImageUrl] = useState('');
  const [modalCaption, setModalCaption] = useState('');
  const [modalAltText, setModalAltText] = useState('');
  const [modalSetAsCover, setModalSetAsCover] = useState(true);
  const [isUploadingInline, setIsUploadingInline] = useState(false);

  const [linkModalOpen, setLinkModalOpen] = useState(false);
  const [linkUrlInput, setLinkUrlInput] = useState('https://');
  const [linkTextInput, setLinkTextInput] = useState('');
  const savedRangeRef = useRef<Range | null>(null);
  const [selectedFigure, setSelectedFigure] = useState<HTMLElement | null>(null);

  // Undo / Redo history
  const undoStackRef = useRef<string[]>(['']);
  const historyIndexRef = useRef<number>(0);

  const pushHistory = useCallback((html: string) => {
    const stack = undoStackRef.current;
    const idx = historyIndexRef.current;
    if (stack[idx] === html) return;
    const nextStack = stack.slice(0, idx + 1);
    nextStack.push(html);
    if (nextStack.length > 60) nextStack.shift();
    undoStackRef.current = nextStack;
    historyIndexRef.current = nextStack.length - 1;
  }, []);

  const syncEditorContent = useCallback(() => {
    if (!editorRef.current) return;
    const html = editorRef.current.innerHTML;
    setEditorHtml(html);
    pushHistory(html);
  }, [pushHistory]);

  // Admin auth check + fetch post
  useEffect(() => {
    const token = getAuthToken();
    const stored = getStoredUser();

    if (!token || !stored) {
      router.replace(
        '/login?redirect=' + encodeURIComponent(`/admin/review-post/${rawId}`)
      );
      return;
    }

    if (stored.role !== 'admin') {
      router.replace(getRoleDashboardPath(stored.role));
      return;
    }

    setUser(stored);
    setAuthChecked(true);

    if (!rawId) {
      setLoadError('Missing article ID');
      setLoadingPost(false);
      return;
    }

    setLoadingPost(true);
    fetch(`${API_BASE_URL}/posts/${encodeURIComponent(rawId)}`, {
      headers: authHeaders(),
      cache: 'no-store',
    })
      .then(async (res) => {
        if (res.status === 401) {
          clearAuthSession();
          router.replace('/login');
          return null;
        }
        const data = await res.json();
        if (!res.ok || !data.success || !data.post) {
          throw new Error(data.message || 'Unable to load article for review');
        }
        return data.post as EditorialPost;
      })
      .then((post) => {
        if (!post) return;
        setPostId(post.id);
        setPostStatus(post.status);
        setPostSlug(post.slug || post.id);
        setTitle(post.title || '');
        setSubtitle(post.subtitle || '');
        setAuthorInfo({
          id: post.author_id,
          name: post.authorName || post.author_name || 'BBC News Staff',
          email: post.author_email || null,
          bio: post.authorBio || post.author_bio || null,
          photo: post.authorProfilePicture || post.author_profile_picture || null,
          linkedin: post.authorLinkedinUrl || post.author_linkedin_url || null,
        });

        const resolvedMain =
          post.mainCategory ||
          post.main_category ||
          post.category ||
          BBC_MAIN_CATEGORIES[0];
        const validMain = BBC_MAIN_CATEGORIES.includes(resolvedMain)
          ? resolvedMain
          : BBC_MAIN_CATEGORIES[0];
        setMainCategory(validMain);

        const subs = parseStringArray(post.sub_categories).filter(
          (s) => s.toLowerCase() !== validMain.toLowerCase()
        );
        setSelectedSubCats(subs.slice(0, 5));

        setTags(parseStringArray(post.tags).slice(0, 8));
        setPlacement(post.placement || post.section_key || 'archive');
        setCardSummary(
          post.cardSummary || post.card_summary || post.summary || ''
        );
        setFocusKeyword(post.focusKeyword || post.focus_keyword || '');
        setMetaDescription(post.metaDescription || post.meta_description || '');
        setReadDuration(String(post.readDuration || post.read_duration || 5));
        setImageUrl(post.imageUrl || post.image_url || '');
        setRejectionReason(post.rejection_reason || post.rejectionReason || '');

        const html = post.content || '';
        setEditorHtml(html);
        undoStackRef.current = [html];
        historyIndexRef.current = 0;
        if (editorRef.current) {
          editorRef.current.innerHTML = html;
        }
      })
      .catch((err: Error) => {
        setLoadError(err.message || 'Failed to load submission');
      })
      .finally(() => {
        setLoadingPost(false);
      });
  }, [rawId, router]);

  useEffect(() => {
    if (!isPreview && editorRef.current && editorRef.current.innerHTML !== editorHtml) {
      editorRef.current.innerHTML = editorHtml;
    }
  }, [isPreview, editorHtml]);

  const handleUndo = () => {
    if (historyIndexRef.current <= 0 || !editorRef.current) return;
    historyIndexRef.current -= 1;
    const prevHtml = undoStackRef.current[historyIndexRef.current] ?? '';
    editorRef.current.innerHTML = prevHtml;
    setEditorHtml(prevHtml);
  };

  const handleRedo = () => {
    if (
      historyIndexRef.current >= undoStackRef.current.length - 1 ||
      !editorRef.current
    ) {
      return;
    }
    historyIndexRef.current += 1;
    const nextHtml = undoStackRef.current[historyIndexRef.current] ?? '';
    editorRef.current.innerHTML = nextHtml;
    setEditorHtml(nextHtml);
  };

  const execCmd = (command: string, value?: string) => {
    if (!editorRef.current) return;
    editorRef.current.focus();
    document.execCommand(command, false, value);
    syncEditorContent();
  };

  const saveCurrentSelection = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      savedRangeRef.current = sel.getRangeAt(0).cloneRange();
      return sel.toString();
    }
    return '';
  };

  const restoreSelection = () => {
    const sel = window.getSelection();
    if (sel && savedRangeRef.current) {
      sel.removeAllRanges();
      sel.addRange(savedRangeRef.current);
    }
  };

  const openLinkModal = () => {
    const selectedText = saveCurrentSelection();
    setLinkTextInput(selectedText);
    setLinkUrlInput('https://');
    setLinkModalOpen(true);
  };

  const handleInsertLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editorRef.current) return;
    const href = linkUrlInput.trim();
    if (!href) return;
    editorRef.current.focus();
    restoreSelection();
    const sel = window.getSelection();
    if (sel && sel.toString().trim().length > 0) {
      document.execCommand('createLink', false, href);
    } else {
      const label = linkTextInput.trim() || href;
      document.execCommand(
        'insertHTML',
        false,
        `<a href="${href.replace(/"/g, '&quot;')}" target="_blank" rel="noopener noreferrer">${label}</a>`
      );
    }
    setLinkModalOpen(false);
    syncEditorContent();
  };

  const handleToggleDropcap = () => {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0 || !editorRef.current) return;
    let node: Node | null = sel.anchorNode;
    while (node && node !== editorRef.current) {
      if (node instanceof HTMLElement && /^(P|DIV|BLOCKQUOTE)$/i.test(node.tagName)) {
        const hasDrop = node.querySelector('span.bbc-dropcap');
        if (hasDrop) {
          hasDrop.replaceWith(document.createTextNode(hasDrop.textContent || ''));
        } else {
          const text = node.textContent || '';
          if (text.trim().length > 0) {
            const firstChar = text.trim().charAt(0);
            const restHtml = node.innerHTML.replace(/^\s*[^<\s]/, '');
            node.innerHTML = `<span class="bbc-dropcap">${firstChar}</span>${restHtml}`;
          }
        }
        syncEditorContent();
        return;
      }
      node = node.parentNode;
    }
  };

  const uploadArticleImageFile = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 1400;
          let width = img.width;
          let height = img.height;
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
          canvas.width = width;
          canvas.height = height;
          canvas.getContext('2d')?.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            async (blob) => {
              if (!blob) {
                reject(new Error('Image processing failed'));
                return;
              }
              const formData = new FormData();
              formData.append('folder', 'articles');
              formData.append(
                'file',
                blob,
                file.name.replace(/\.[^/.]+$/, '') + '.webp'
              );
              try {
                const res = await fetch(`${API_BASE_URL}/upload`, {
                  method: 'POST',
                  headers: authHeaders(),
                  body: formData,
                });
                const data = await res.json();
                if (!res.ok || !data.success || !data.url) {
                  reject(new Error(data.message || 'Upload failed'));
                  return;
                }
                resolve(resolveMediaUrl(data.url));
              } catch {
                reject(new Error('Network error during upload'));
              }
            },
            'image/webp',
            0.86
          );
        };
        img.onerror = () => reject(new Error('Unsupported image file'));
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleCoverFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingCover(true);
    setBannerMessage(null);
    try {
      const uploadedUrl = await uploadArticleImageFile(file);
      setImageUrl(uploadedUrl);
    } catch (err) {
      setBannerMessage({
        type: 'error',
        text: err instanceof Error ? err.message : 'Failed to upload cover image',
      });
    } finally {
      setIsUploadingCover(false);
      e.target.value = '';
    }
  };

  const handleInlineModalFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingInline(true);
    try {
      const uploadedUrl = await uploadArticleImageFile(file);
      setModalImageUrl(uploadedUrl);
    } catch (err) {
      setBannerMessage({
        type: 'error',
        text: err instanceof Error ? err.message : 'Failed to upload image',
      });
    } finally {
      setIsUploadingInline(false);
      e.target.value = '';
    }
  };

  const handleInsertInlineImage = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUrl = resolveMediaUrl(modalImageUrl.trim());
    if (!cleanUrl || !editorRef.current) return;

    if (modalSetAsCover && !imageUrl.trim()) {
      setImageUrl(cleanUrl);
    }

    editorRef.current.focus();
    restoreSelection();

    const safeAlt = (modalAltText.trim() || title.trim() || 'BBC article image').replace(
      /"/g,
      '&quot;'
    );
    const captionHtml = modalCaption.trim()
      ? `<figcaption>${modalCaption.trim()}</figcaption>`
      : '';

    const figureHtml = `<figure class="my-6 w-full" data-size="full" data-align="center"><img src="${cleanUrl}" alt="${safeAlt}" class="w-full h-auto rounded-sm object-cover" />${captionHtml}</figure><p><br></p>`;

    document.execCommand('insertHTML', false, figureHtml);
    setImageModalOpen(false);
    setModalImageUrl('');
    setModalCaption('');
    setModalAltText('');
    syncEditorContent();
  };

  const handleEditorClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (target.tagName === 'IMG') {
      const figure = target.closest('figure');
      setSelectedFigure(figure || target);
    } else if (!target.closest('[data-image-toolbar="true"]')) {
      setSelectedFigure(null);
    }
  };

  const adjustSelectedFigureSize = (size: 'small' | 'medium' | 'full') => {
    if (!selectedFigure) return;
    const widthClass =
      size === 'small'
        ? 'max-w-[340px]'
        : size === 'medium'
        ? 'max-w-[560px]'
        : 'w-full';
    selectedFigure.classList.remove('max-w-[340px]', 'max-w-[560px]', 'w-full');
    selectedFigure.classList.add(widthClass);
    syncEditorContent();
  };

  const adjustSelectedFigureAlign = (align: 'left' | 'center' | 'right') => {
    if (!selectedFigure) return;
    selectedFigure.classList.remove('mr-auto', 'mx-auto', 'ml-auto');
    if (align === 'left') selectedFigure.classList.add('mr-auto');
    else if (align === 'right') selectedFigure.classList.add('ml-auto');
    else selectedFigure.classList.add('mx-auto');
    syncEditorContent();
  };

  const removeSelectedFigure = () => {
    if (!selectedFigure) return;
    selectedFigure.remove();
    setSelectedFigure(null);
    syncEditorContent();
  };

  const toggleSubCategory = (subName: string) => {
    setSelectedSubCats((prev) => {
      if (prev.includes(subName)) {
        return prev.filter((item) => item !== subName);
      }
      if (prev.length >= 5) {
        setBannerMessage({
          type: 'error',
          text: 'Maximum 5 sub-categories per article.',
        });
        return prev;
      }
      setBannerMessage(null);
      return [...prev, subName];
    });
  };

  const handleAddTag = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleaned = tagInput.trim();
    if (!cleaned) return;
    if (tags.includes(cleaned)) {
      setTagInput('');
      return;
    }
    if (tags.length >= 8) {
      setBannerMessage({ type: 'error', text: 'Maximum 8 tags allowed.' });
      return;
    }
    setTags((prev) => [...prev, cleaned]);
    setTagInput('');
  };

  const handleAutoGenerateSeo = () => {
    const plainBody = (editorRef.current?.innerText || editorHtml.replace(/<[^>]+>/g, ' '))
      .replace(/\s+/g, ' ')
      .trim();

    if (!cardSummary.trim()) {
      setCardSummary(subtitle.trim() || plainBody.slice(0, 155));
    }
    if (!focusKeyword.trim() && title.trim()) {
      const stopWords = new Set(['the', 'and', 'for', 'with', 'that', 'this', 'from', 'into', 'over', 'amid', 'what', 'when', 'where', 'why', 'how']);
      const words = title
        .replace(/[^a-zA-Z0-9\s]/g, '')
        .split(/\s+/)
        .filter((w) => w.length > 3 && !stopWords.has(w.toLowerCase()));
      setFocusKeyword(words.slice(0, 2).join(' ') || mainCategory);
    }
    if (!metaDescription.trim()) {
      const base = subtitle.trim() || cardSummary.trim() || plainBody || title.trim();
      setMetaDescription(base.slice(0, 158));
    }
  };

  const handleApproveAndPublish = async () => {
    if (isProcessing) return;
    setBannerMessage(null);

    const currentHtml = editorRef.current ? editorRef.current.innerHTML : editorHtml;
    const plainText = (
      editorRef.current?.innerText || currentHtml.replace(/<[^>]+>/g, ' ')
    )
      .replace(/\s+/g, ' ')
      .trim();

    const effectiveCover = imageUrl.trim() || extractFirstImageSrc(currentHtml);

    if (!title.trim()) {
      setBannerMessage({ type: 'error', text: 'Headline is required to publish.' });
      return;
    }
    if (!plainText) {
      setBannerMessage({ type: 'error', text: 'Article body cannot be empty.' });
      return;
    }
    if (!effectiveCover) {
      setBannerMessage({
        type: 'error',
        text: 'At least one cover or inline image is required before publishing.',
      });
      return;
    }

    setIsProcessing('publish');
    try {
      const res = await fetch(
        `${API_BASE_URL}/posts/${encodeURIComponent(postId)}`,
        {
          method: 'PUT',
          headers: authHeaders({ 'Content-Type': 'application/json' }),
          body: JSON.stringify({
            title: title.trim(),
            subtitle: subtitle.trim(),
            content: currentHtml,
            mainCategory,
            selectedSubCats,
            tags,
            cardSummary: cardSummary.trim() || subtitle.trim(),
            focusKeyword: focusKeyword.trim(),
            metaDescription: metaDescription.trim(),
            readDuration: Math.max(1, Number(readDuration) || 5),
            imageUrl: effectiveCover,
            placement: placement || 'archive',
            status: 'published',
          }),
        }
      );

      if (res.status === 401) {
        clearAuthSession();
        router.replace('/login');
        return;
      }

      const data = await res.json();
      if (!res.ok || !data.success) {
        setBannerMessage({
          type: 'error',
          text: data.message || 'Failed to publish article.',
        });
        return;
      }

      setPostStatus('published');
      if (data.slug) setPostSlug(data.slug);
      router.push('/admin/dashboard?tab=publishedPosts');
    } catch {
      setBannerMessage({
        type: 'error',
        text: 'Network error while publishing article.',
      });
    } finally {
      setIsProcessing(null);
    }
  };

  const handleRejectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isProcessing) return;
    if (!rejectionReason.trim()) {
      setBannerMessage({
        type: 'error',
        text: 'Please provide clear editorial feedback explaining why the submission was rejected.',
      });
      return;
    }

    setIsProcessing('reject');
    setBannerMessage(null);
    try {
      const currentHtml = editorRef.current ? editorRef.current.innerHTML : editorHtml;
      const effectiveCover = imageUrl.trim() || extractFirstImageSrc(currentHtml);

      const res = await fetch(
        `${API_BASE_URL}/posts/${encodeURIComponent(postId)}`,
        {
          method: 'PUT',
          headers: authHeaders({ 'Content-Type': 'application/json' }),
          body: JSON.stringify({
            title: title.trim() || 'Untitled Submission',
            subtitle: subtitle.trim(),
            content: currentHtml,
            mainCategory,
            selectedSubCats,
            tags,
            cardSummary: cardSummary.trim() || subtitle.trim(),
            focusKeyword: focusKeyword.trim(),
            metaDescription: metaDescription.trim(),
            readDuration: Math.max(1, Number(readDuration) || 5),
            imageUrl: effectiveCover,
            placement: 'archive',
            status: 'rejected',
            rejectionReason: rejectionReason.trim(),
          }),
        }
      );

      const data = await res.json();
      if (!res.ok || !data.success) {
        setBannerMessage({
          type: 'error',
          text: data.message || 'Failed to reject submission.',
        });
        return;
      }

      setRejectModalOpen(false);
      router.push('/admin/dashboard?tab=overview');
    } catch {
      setBannerMessage({
        type: 'error',
        text: 'Network error while rejecting submission.',
      });
    } finally {
      setIsProcessing(null);
    }
  };

  const mainSubCategories = useMemo(
    () => getSubcategoriesForMain(mainCategory),
    [mainCategory]
  );

  const filteredSubGroups = useMemo(() => {
    const q = subCatSearch.trim().toLowerCase();
    return BBC_SUBCATEGORIES_BY_MAIN.map((group) => ({
      ...group,
      subcategories: q
        ? group.subcategories.filter(
            (sub) =>
              sub.toLowerCase().includes(q) ||
              group.mainName.toLowerCase().includes(q)
          )
        : group.subcategories,
    })).filter((g) => g.subcategories.length > 0);
  }, [subCatSearch]);

  if (!authChecked || loadingPost || !user) {
    return <SkeletonPage />;
  }

  if (loadError) {
    return (
      <div className="min-h-screen bg-[#f4f5f7] flex items-center justify-center p-6 font-sans">
        <div className="bg-white border border-gray-200 rounded-lg p-8 max-w-md w-full text-center shadow-sm">
          <h1 className="text-xl font-serif font-bold text-[#141414] mb-2">
            Unable to Open Submission
          </h1>
          <p className="text-xs text-red-700 mb-6">{loadError}</p>
          <Link
            href="/admin/dashboard"
            className="inline-block px-5 py-2.5 bg-black text-white text-xs font-bold uppercase tracking-wider rounded"
          >
            Back to Admin Desk
          </Link>
        </div>
      </div>
    );
  }

  const resolvedCover = resolveMediaUrl(imageUrl);
  const kwLower = focusKeyword.trim().toLowerCase();
  const titleHasKw = kwLower ? title.toLowerCase().includes(kwLower) : false;
  const bodyHasKw = kwLower
    ? editorHtml.replace(/<[^>]+>/g, ' ').toLowerCase().includes(kwLower)
    : false;

  return (
    <div className="min-h-screen bg-[#f4f5f7] flex flex-col font-sans text-[#141414]">
      {/* Fixed Editorial Review Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <Link
              href="/admin/dashboard"
              className="px-3 py-1.5 border border-gray-300 rounded text-xs font-bold text-neutral-700 hover:bg-gray-50 transition-colors"
            >
              ← Admin Desk
            </Link>

            <div className="hidden md:flex items-center gap-2.5 border-l border-gray-200 pl-3 min-w-0">
              <span
                className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                  postStatus === 'published'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-amber-50 text-amber-800 border border-amber-200'
                }`}
              >
                {postStatus === 'published' ? 'Live Published' : 'Pending Review'}
              </span>
              <span className="text-xs text-neutral-600 truncate">
                Submitted by <strong className="text-black">{authorInfo.name}</strong>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-2.5 flex-shrink-0">
            {postStatus === 'published' && postSlug && (
              <Link
                href={`/news/articles/${encodeURIComponent(postSlug)}`}
                className="hidden sm:inline-block px-3 py-2 border border-gray-300 rounded text-xs font-bold text-neutral-700 hover:bg-gray-50"
              >
                View Live
              </Link>
            )}

            <button
              type="button"
              onClick={() => setIsPreview((p) => !p)}
              className={`px-3.5 py-2 rounded text-xs font-bold border transition-colors cursor-pointer ${
                isPreview
                  ? 'bg-black text-white border-black'
                  : 'bg-white text-neutral-800 border-gray-300 hover:bg-gray-50'
              }`}
            >
              {isPreview ? 'Back to Editor' : 'Preview'}
            </button>

            <button
              type="button"
              disabled={isProcessing !== null}
              onClick={() => setRejectModalOpen(true)}
              className="px-4 py-2 rounded text-xs font-bold bg-red-50 border border-red-300 text-[#bb1919] hover:bg-red-100 cursor-pointer disabled:opacity-60"
            >
              REJECT
            </button>

            <button
              type="button"
              disabled={isProcessing !== null}
              onClick={handleApproveAndPublish}
              className="px-4 sm:px-5 py-2 rounded text-xs font-bold bg-[#bb1919] hover:bg-[#9d1414] text-white flex items-center gap-1.5 shadow-sm cursor-pointer disabled:opacity-60"
            >
              {isProcessing === 'publish' ? <Spinner className="w-3.5 h-3.5" /> : null}
              <span>
                {postStatus === 'published' ? 'UPDATE & PUBLISH' : 'APPROVE & PUBLISH'}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Banner Feedback */}
      {bannerMessage && (
        <div
          className={`px-4 sm:px-6 py-2.5 text-xs font-semibold border-b ${
            bannerMessage.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-red-50 border-red-200 text-red-700'
          }`}
        >
          <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-2">
            <span>{bannerMessage.text}</span>
            <button
              type="button"
              onClick={() => setBannerMessage(null)}
              className="underline cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {isPreview ? (
        <main className="flex-1 bg-white">
          <article className="max-w-[780px] mx-auto px-4 sm:px-6 py-10">
            <div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#bb1919] mb-3">
              <span>{mainCategory}</span>
              {selectedSubCats.map((s) => (
                <span key={s} className="text-neutral-500">
                  · {s}
                </span>
              ))}
            </div>

            <h1 className="font-serif font-bold text-3xl sm:text-4xl lg:text-[42px] leading-[1.12] text-[#141414]">
              {title.trim() || 'Headline preview'}
            </h1>

            {subtitle.trim() && (
              <p className="mt-3 text-lg text-neutral-600 leading-relaxed">
                {subtitle}
              </p>
            )}

            <AuthorProfile
              authorId={authorInfo.id}
              authorName={authorInfo.name}
              authorBio={authorInfo.bio}
              authorPhoto={resolveMediaUrl(authorInfo.photo)}
              authorLinkedin={authorInfo.linkedin}
              publishDate="Editorial Preview"
              readTime={`${readDuration || '5'} min read`}
              disableLinks={true}
              article={{ title: title.trim() || 'Preview' }}
            />

            {resolvedCover && extractFirstImageSrc(editorHtml) !== resolvedCover && (
              <figure className="my-6">
                <img
                  src={resolvedCover}
                  alt={title || 'Cover preview'}
                  className="w-full max-h-[460px] object-cover rounded-sm"
                />
              </figure>
            )}

            <div
              className="bbc-article-content mt-6 text-[17px] leading-[1.7] text-[#141414]"
              dangerouslySetInnerHTML={{ __html: editorHtml }}
            />
          </article>
        </main>
      ) : (
        <div className="max-w-[1440px] w-full mx-auto px-4 sm:px-6 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 items-start">
          {/* Left 8 cols: Editorial Review Canvas */}
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
              <div className="p-6 pb-4 border-b border-gray-100 space-y-3">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Article Headline..."
                  className="w-full text-2xl sm:text-3xl font-serif font-bold text-[#141414] placeholder:text-neutral-300 focus:outline-none"
                />
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="Optional standfirst / sub-headline..."
                  className="w-full text-base text-neutral-600 placeholder:text-neutral-300 focus:outline-none"
                />
              </div>

              {/* Sticky Formatting Toolbar */}
              <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-200 flex flex-wrap items-center gap-1 sticky top-16 z-20">
                <button
                  type="button"
                  onClick={handleUndo}
                  title="Undo"
                  className="px-2 py-1.5 rounded text-xs font-bold text-neutral-700 hover:bg-gray-200 cursor-pointer"
                >
                  ↺
                </button>
                <button
                  type="button"
                  onClick={handleRedo}
                  title="Redo"
                  className="px-2 py-1.5 rounded text-xs font-bold text-neutral-700 hover:bg-gray-200 cursor-pointer"
                >
                  ↻
                </button>
                <span className="w-px h-5 bg-gray-300 mx-1" />
                <button
                  type="button"
                  onClick={() => execCmd('bold')}
                  className="px-2.5 py-1.5 rounded text-xs font-bold text-neutral-800 hover:bg-gray-200 cursor-pointer"
                >
                  B
                </button>
                <button
                  type="button"
                  onClick={() => execCmd('italic')}
                  className="px-2.5 py-1.5 rounded text-xs italic font-serif font-bold text-neutral-800 hover:bg-gray-200 cursor-pointer"
                >
                  I
                </button>
                <button
                  type="button"
                  onClick={() => execCmd('underline')}
                  className="px-2.5 py-1.5 rounded text-xs underline font-bold text-neutral-800 hover:bg-gray-200 cursor-pointer"
                >
                  U
                </button>
                <span className="w-px h-5 bg-gray-300 mx-1" />
                <button
                  type="button"
                  onClick={() => execCmd('formatBlock', '<h2>')}
                  className="px-2.5 py-1.5 rounded text-xs font-bold text-neutral-700 hover:bg-gray-200 cursor-pointer"
                >
                  H2
                </button>
                <button
                  type="button"
                  onClick={() => execCmd('formatBlock', '<h3>')}
                  className="px-2.5 py-1.5 rounded text-xs font-bold text-neutral-700 hover:bg-gray-200 cursor-pointer"
                >
                  H3
                </button>
                <button
                  type="button"
                  onClick={() => execCmd('formatBlock', '<p>')}
                  className="px-2.5 py-1.5 rounded text-xs font-bold text-neutral-700 hover:bg-gray-200 cursor-pointer"
                >
                  P
                </button>
                <button
                  type="button"
                  onClick={handleToggleDropcap}
                  className="px-2.5 py-1.5 rounded text-xs font-bold text-neutral-700 hover:bg-gray-200 cursor-pointer"
                >
                  A+
                </button>
                <span className="w-px h-5 bg-gray-300 mx-1" />
                <button
                  type="button"
                  onClick={() => execCmd('insertUnorderedList')}
                  className="px-2.5 py-1.5 rounded text-xs font-bold text-neutral-700 hover:bg-gray-200 cursor-pointer"
                >
                  • List
                </button>
                <button
                  type="button"
                  onClick={() => execCmd('insertOrderedList')}
                  className="px-2.5 py-1.5 rounded text-xs font-bold text-neutral-700 hover:bg-gray-200 cursor-pointer"
                >
                  1. List
                </button>
                <button
                  type="button"
                  onClick={() => execCmd('formatBlock', '<blockquote>')}
                  className="px-2.5 py-1.5 rounded text-xs font-bold text-neutral-700 hover:bg-gray-200 cursor-pointer"
                >
                  &ldquo; Quote
                </button>
                <button
                  type="button"
                  onClick={openLinkModal}
                  className="px-2.5 py-1.5 rounded text-xs font-bold text-neutral-700 hover:bg-gray-200 cursor-pointer"
                >
                  Link
                </button>
                <button
                  type="button"
                  onClick={() => {
                    saveCurrentSelection();
                    setImageModalOpen(true);
                  }}
                  className="ml-auto px-3 py-1.5 rounded bg-black text-white text-xs font-bold hover:bg-neutral-800 cursor-pointer"
                >
                  + Insert Image
                </button>
              </div>

              {selectedFigure && (
                <div
                  data-image-toolbar="true"
                  className="px-4 py-2 bg-slate-900 text-white text-xs flex flex-wrap items-center justify-between gap-2"
                >
                  <span className="font-bold uppercase tracking-wider text-[10px] text-slate-300">
                    Selected Image
                  </span>
                  <div className="flex flex-wrap items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => adjustSelectedFigureSize('small')}
                      className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 cursor-pointer"
                    >
                      S
                    </button>
                    <button
                      type="button"
                      onClick={() => adjustSelectedFigureSize('medium')}
                      className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 cursor-pointer"
                    >
                      M
                    </button>
                    <button
                      type="button"
                      onClick={() => adjustSelectedFigureSize('full')}
                      className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 cursor-pointer"
                    >
                      Full
                    </button>
                    <span className="text-slate-600">|</span>
                    <button
                      type="button"
                      onClick={() => adjustSelectedFigureAlign('left')}
                      className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 cursor-pointer"
                    >
                      Left
                    </button>
                    <button
                      type="button"
                      onClick={() => adjustSelectedFigureAlign('center')}
                      className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 cursor-pointer"
                    >
                      Center
                    </button>
                    <button
                      type="button"
                      onClick={() => adjustSelectedFigureAlign('right')}
                      className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 cursor-pointer"
                    >
                      Right
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const img =
                          selectedFigure.tagName === 'IMG'
                            ? (selectedFigure as HTMLImageElement)
                            : selectedFigure.querySelector('img');
                        if (img?.src) setImageUrl(img.src);
                      }}
                      className="px-2 py-1 rounded bg-[#00508f] hover:bg-blue-800 cursor-pointer"
                    >
                      Use as Cover
                    </button>
                    <button
                      type="button"
                      onClick={removeSelectedFigure}
                      className="px-2 py-1 rounded bg-[#bb1919] hover:bg-red-800 cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              )}

              <div
                ref={editorRef}
                contentEditable
                suppressContentEditableWarning
                onInput={syncEditorContent}
                onClick={handleEditorClick}
                className="bbc-article-content min-h-[540px] p-6 focus:outline-none text-[16px] leading-[1.7] text-[#141414]"
              />
            </div>
          </div>

          {/* Right 4 cols: Admin Placement, Categories & SEO */}
          <aside className="lg:col-span-4 space-y-4">
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
              <div className="px-5 py-3.5 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-800">
                  Editorial Review Settings
                </h2>
                <div className="flex items-center bg-gray-100 rounded p-0.5">
                  <button
                    type="button"
                    onClick={() => setSidebarTab('DETAILS')}
                    className={`px-3 py-1 rounded text-[11px] font-bold cursor-pointer ${
                      sidebarTab === 'DETAILS'
                        ? 'bg-white text-black shadow-sm'
                        : 'text-neutral-500'
                    }`}
                  >
                    DETAILS
                  </button>
                  <button
                    type="button"
                    onClick={() => setSidebarTab('SEO')}
                    className={`px-3 py-1 rounded text-[11px] font-bold cursor-pointer ${
                      sidebarTab === 'SEO'
                        ? 'bg-white text-black shadow-sm'
                        : 'text-neutral-500'
                    }`}
                  >
                    SEO
                  </button>
                </div>
              </div>

              {sidebarTab === 'DETAILS' ? (
                <div className="p-5 space-y-5">
                  {/* BBC Homepage Placement (Admin Exclusive) */}
                  <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-md">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#00508f] mb-1.5">
                      BBC Homepage Placement
                    </label>
                    <select
                      value={placement}
                      onChange={(e) => setPlacement(e.target.value)}
                      className="w-full border border-blue-300 rounded px-3 py-2 text-xs font-bold text-neutral-900 bg-white focus:outline-none focus:border-[#00508f]"
                    >
                      {BBC_PLACEMENTS.map((opt) => (
                        <option key={opt.key} value={opt.key}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    <p className="text-[11px] text-neutral-600 mt-1.5 leading-snug">
                      Choose where this article appears on the BBC homepage or keep it in Category &amp; Search archive.
                    </p>
                  </div>

                  {/* Cover Image */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-2">
                      Cover / Lead Image
                    </label>
                    {resolvedCover ? (
                      <div className="relative rounded overflow-hidden border border-gray-200 mb-2">
                        <img
                          src={resolvedCover}
                          alt="Article cover"
                          className="w-full h-36 object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => setImageUrl('')}
                          className="absolute top-2 right-2 px-2 py-1 bg-black/75 text-white text-[10px] font-bold rounded cursor-pointer hover:bg-black"
                        >
                          Remove
                        </button>
                      </div>
                    ) : null}

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        disabled={isUploadingCover}
                        onClick={() => coverInputRef.current?.click()}
                        className="px-3 py-2 bg-neutral-900 text-white text-xs font-bold rounded hover:bg-neutral-800 flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
                      >
                        {isUploadingCover ? <Spinner className="w-3.5 h-3.5" /> : null}
                        <span>{isUploadingCover ? 'Uploading...' : 'Upload Image'}</span>
                      </button>
                      <input
                        ref={coverInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleCoverFileSelect}
                        className="hidden"
                      />
                      <input
                        type="url"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        placeholder="Or paste image URL..."
                        className="flex-1 min-w-0 border border-gray-300 rounded px-2.5 py-2 text-xs text-neutral-800 focus:outline-none focus:border-black"
                      />
                    </div>
                  </div>

                  {/* Main Category */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
                      BBC Main Category
                    </label>
                    <select
                      value={mainCategory}
                      onChange={(e) => setMainCategory(e.target.value)}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm font-medium text-neutral-900 bg-white focus:outline-none focus:border-black"
                    >
                      {BBC_MAIN_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Sub-categories */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                        Sub-Categories ({selectedSubCats.length}/5)
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowAllSubCats((v) => !v)}
                        className="text-[11px] font-bold text-[#00508f] hover:underline cursor-pointer"
                      >
                        {showAllSubCats ? 'Primary Only' : 'Browse All 84'}
                      </button>
                    </div>

                    {selectedSubCats.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {selectedSubCats.map((sub) => (
                          <button
                            key={sub}
                            type="button"
                            onClick={() => toggleSubCategory(sub)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-black text-white text-[11px] font-bold cursor-pointer"
                          >
                            <span>{sub}</span>
                            <span>×</span>
                          </button>
                        ))}
                      </div>
                    )}

                    {!showAllSubCats ? (
                      <div className="flex flex-wrap gap-1.5">
                        {mainSubCategories.map((sub) => {
                          const active = selectedSubCats.includes(sub);
                          return (
                            <button
                              key={sub}
                              type="button"
                              onClick={() => toggleSubCategory(sub)}
                              className={`px-2.5 py-1 rounded text-xs font-medium border transition-colors cursor-pointer ${
                                active
                                  ? 'bg-[#bb1919] text-white border-[#bb1919]'
                                  : 'bg-gray-50 text-neutral-700 border-gray-200 hover:border-gray-400'
                              }`}
                            >
                              {sub}
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="border border-gray-200 rounded p-2.5 bg-gray-50 space-y-2.5">
                        <input
                          type="text"
                          value={subCatSearch}
                          onChange={(e) => setSubCatSearch(e.target.value)}
                          placeholder="Search all BBC sub-categories..."
                          className="w-full border border-gray-300 rounded px-2.5 py-1.5 text-xs bg-white focus:outline-none focus:border-black"
                        />
                        <div className="max-h-48 overflow-y-auto custom-scrollbar space-y-2.5 pr-1">
                          {filteredSubGroups.map((group) => (
                            <div key={group.mainName}>
                              <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-1">
                                {group.mainName}
                              </div>
                              <div className="flex flex-wrap gap-1">
                                {group.subcategories.map((sub) => {
                                  const active = selectedSubCats.includes(sub);
                                  return (
                                    <button
                                      key={sub}
                                      type="button"
                                      onClick={() => toggleSubCategory(sub)}
                                      className={`px-2 py-0.5 rounded text-[11px] border cursor-pointer ${
                                        active
                                          ? 'bg-[#bb1919] text-white border-[#bb1919] font-bold'
                                          : 'bg-white text-neutral-700 border-gray-200 hover:border-gray-400'
                                      }`}
                                    >
                                      {sub}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Tags */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
                      Tags ({tags.length}/8)
                    </label>
                    <form onSubmit={handleAddTag} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        placeholder="Add topic tag..."
                        className="flex-1 border border-gray-300 rounded px-3 py-1.5 text-xs focus:outline-none focus:border-black"
                      />
                      <button
                        type="submit"
                        className="px-3 py-1.5 bg-neutral-800 text-white text-xs font-bold rounded hover:bg-black cursor-pointer"
                      >
                        Add
                      </button>
                    </form>
                    {tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {tags.map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-100 text-neutral-700 rounded text-xs font-medium"
                          >
                            <span>#{tag}</span>
                            <button
                              type="button"
                              onClick={() => setTags((p) => p.filter((t) => t !== tag))}
                              className="text-neutral-400 hover:text-[#bb1919] cursor-pointer"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Read Duration */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
                      Estimated Read Time (Minutes)
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={60}
                      value={readDuration}
                      onChange={(e) => setReadDuration(e.target.value)}
                      className="w-28 border border-gray-300 rounded px-3 py-1.5 text-sm font-medium focus:outline-none focus:border-black"
                    />
                  </div>
                </div>
              ) : (
                <div className="p-5 space-y-4">
                  <button
                    type="button"
                    onClick={handleAutoGenerateSeo}
                    className="w-full py-2 bg-[#00508f] hover:bg-blue-900 text-white text-xs font-bold rounded transition-colors cursor-pointer"
                  >
                    Auto-Generate SEO Metadata
                  </button>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
                      Card Summary / Excerpt
                    </label>
                    <textarea
                      rows={2}
                      value={cardSummary}
                      onChange={(e) => setCardSummary(e.target.value)}
                      placeholder="Short summary shown on newsroom cards..."
                      className="w-full border border-gray-300 rounded px-3 py-2 text-xs text-neutral-900 focus:outline-none focus:border-black resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
                      Focus Keyword
                    </label>
                    <input
                      type="text"
                      value={focusKeyword}
                      onChange={(e) => setFocusKeyword(e.target.value)}
                      placeholder="e.g. Global Trade"
                      className="w-full border border-gray-300 rounded px-3 py-2 text-xs text-neutral-900 focus:outline-none focus:border-black"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                        Meta Description
                      </label>
                      <span
                        className={`text-[10px] font-bold ${
                          metaDescription.length > 160 ? 'text-[#bb1919]' : 'text-neutral-400'
                        }`}
                      >
                        {metaDescription.length}/160
                      </span>
                    </div>
                    <textarea
                      rows={3}
                      value={metaDescription}
                      onChange={(e) => setMetaDescription(e.target.value)}
                      placeholder="Search engine description..."
                      className="w-full border border-gray-300 rounded px-3 py-2 text-xs text-neutral-900 focus:outline-none focus:border-black resize-none"
                    />
                  </div>

                  <div className="p-3 bg-gray-50 border border-gray-200 rounded space-y-1.5 text-[11px]">
                    <div className="font-bold text-neutral-700 mb-1">SEO Health</div>
                    <div className={titleHasKw ? 'text-emerald-700' : 'text-neutral-500'}>
                      {titleHasKw ? '✓' : '○'} Focus keyword appears in headline
                    </div>
                    <div className={bodyHasKw ? 'text-emerald-700' : 'text-neutral-500'}>
                      {bodyHasKw ? '✓' : '○'} Focus keyword appears in article body
                    </div>
                    <div
                      className={
                        metaDescription.length >= 110 && metaDescription.length <= 165
                          ? 'text-emerald-700'
                          : 'text-neutral-500'
                      }
                    >
                      {metaDescription.length >= 110 && metaDescription.length <= 165 ? '✓' : '○'}{' '}
                      Meta description optimal length
                    </div>
                  </div>

                  <div className="p-3.5 border border-gray-200 rounded bg-white">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-2">
                      Search Result Preview
                    </div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="inline-flex items-center gap-[1px]">
                        <span className="w-3.5 h-3.5 bg-black text-white font-bold text-[8px] flex items-center justify-center">
                          B
                        </span>
                        <span className="w-3.5 h-3.5 bg-black text-white font-bold text-[8px] flex items-center justify-center">
                          B
                        </span>
                        <span className="w-3.5 h-3.5 bg-black text-white font-bold text-[8px] flex items-center justify-center">
                          C
                        </span>
                      </span>
                      <span className="text-[11px] text-neutral-600 truncate">
                        www.bbc.com › news › articles › {slugPreview(title)}
                      </span>
                    </div>
                    <div className="text-[15px] font-medium text-[#1a0dab] leading-snug line-clamp-2">
                      {title.trim() || 'Headline Preview — BBC News'}
                    </div>
                    <p className="text-xs text-neutral-600 mt-1 line-clamp-2">
                      {metaDescription.trim() ||
                        cardSummary.trim() ||
                        subtitle.trim() ||
                        'Read comprehensive coverage and analysis from BBC News.'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>
      )}

      {/* Reject Reason Modal */}
      {rejectModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[300] flex items-center justify-center p-4">
          <form
            onSubmit={handleRejectSubmit}
            className="bg-white rounded-xl max-w-[480px] w-full p-6 shadow-2xl border border-gray-200 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-serif font-bold text-[#141414]">
                Return Article for Revision
              </h3>
              <button
                type="button"
                onClick={() => setRejectModalOpen(false)}
                className="text-neutral-400 hover:text-black cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-neutral-600">
              Explain what needs to be updated before re-submission. The writer will see this note on their dashboard.
            </p>

            <textarea
              rows={4}
              required
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="e.g. Please verify the trade figures in paragraph 3 and add a clearer lead image caption."
              className="w-full border border-gray-300 rounded px-3.5 py-2.5 text-sm text-neutral-900 focus:outline-none focus:border-[#bb1919] resize-none"
            />

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                disabled={isProcessing !== null}
                onClick={() => setRejectModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded text-xs font-bold text-neutral-700 hover:bg-gray-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isProcessing !== null}
                className="px-4 py-2 bg-[#bb1919] hover:bg-[#9d1414] text-white rounded text-xs font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
              >
                {isProcessing === 'reject' ? <Spinner className="w-3.5 h-3.5" /> : null}
                <span>Confirm Rejection</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Insert Image Modal */}
      {imageModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[300] flex items-center justify-center p-4">
          <form
            onSubmit={handleInsertInlineImage}
            className="bg-white rounded-xl max-w-[460px] w-full p-6 shadow-2xl border border-gray-200 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-serif font-bold text-[#141414]">
                Insert Article Image
              </h3>
              <button
                type="button"
                onClick={() => setImageModalOpen(false)}
                className="text-neutral-400 hover:text-black cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
                Upload Image (WebP)
              </label>
              <button
                type="button"
                disabled={isUploadingInline}
                onClick={() => modalImageInputRef.current?.click()}
                className="w-full py-2.5 border border-dashed border-gray-400 rounded text-xs font-bold text-neutral-700 hover:border-black cursor-pointer"
              >
                {isUploadingInline ? 'Uploading & Optimizing...' : 'Choose Image File'}
              </button>
              <input
                ref={modalImageInputRef}
                type="file"
                accept="image/*"
                onChange={handleInlineModalFileSelect}
                className="hidden"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
                Or Paste Image URL
              </label>
              <input
                type="url"
                value={modalImageUrl}
                onChange={(e) => setModalImageUrl(e.target.value)}
                placeholder="https://..."
                className="w-full border border-gray-300 rounded px-3 py-2 text-xs focus:outline-none focus:border-black"
              />
            </div>

            {modalImageUrl.trim() && (
              <img
                src={resolveMediaUrl(modalImageUrl.trim())}
                alt="Preview"
                className="w-full h-36 object-cover rounded border border-gray-200"
              />
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1">
                  Caption (Optional)
                </label>
                <input
                  type="text"
                  value={modalCaption}
                  onChange={(e) => setModalCaption(e.target.value)}
                  placeholder="Photo credit or caption"
                  className="w-full border border-gray-300 rounded px-3 py-1.5 text-xs focus:outline-none focus:border-black"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1">
                  Alt Text
                </label>
                <input
                  type="text"
                  value={modalAltText}
                  onChange={(e) => setModalAltText(e.target.value)}
                  placeholder="Describe the image"
                  className="w-full border border-gray-300 rounded px-3 py-1.5 text-xs focus:outline-none focus:border-black"
                />
              </div>
            </div>

            <label className="flex items-center gap-2 text-xs text-neutral-700 cursor-pointer">
              <input
                type="checkbox"
                checked={modalSetAsCover}
                onChange={(e) => setModalSetAsCover(e.target.checked)}
              />
              <span>Also use as cover image if none is set</span>
            </label>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setImageModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded text-xs font-bold text-neutral-700 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!modalImageUrl.trim() || isUploadingInline}
                className="px-4 py-2 bg-black text-white rounded text-xs font-bold hover:bg-neutral-800 disabled:opacity-50 cursor-pointer"
              >
                Insert Into Body
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Insert Link Modal */}
      {linkModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[300] flex items-center justify-center p-4">
          <form
            onSubmit={handleInsertLink}
            className="bg-white rounded-xl max-w-[420px] w-full p-6 shadow-2xl border border-gray-200 space-y-4"
          >
            <h3 className="text-lg font-serif font-bold text-[#141414]">Insert Link</h3>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1">
                Link Text
              </label>
              <input
                type="text"
                value={linkTextInput}
                onChange={(e) => setLinkTextInput(e.target.value)}
                placeholder="Highlighted phrase"
                className="w-full border border-gray-300 rounded px-3 py-2 text-xs focus:outline-none focus:border-black"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1">
                Destination URL
              </label>
              <input
                type="url"
                required
                value={linkUrlInput}
                onChange={(e) => setLinkUrlInput(e.target.value)}
                placeholder="https://www.bbc.com/..."
                className="w-full border border-gray-300 rounded px-3 py-2 text-xs focus:outline-none focus:border-black"
              />
            </div>
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setLinkModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded text-xs font-bold text-neutral-700 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-black text-white rounded text-xs font-bold cursor-pointer"
              >
                Apply Link
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
