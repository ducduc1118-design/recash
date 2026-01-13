import React, { useEffect, useMemo, useState } from 'react';
import { Plus, Trash2, Pencil } from 'lucide-react';
import {
  Button,
  Input,
  Modal,
  StatusBadge,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Toast,
} from '@/components/ui';
import { adminService } from '@/services/admin.service';
import type { Banner } from '@/types/domain';

type BannerFormState = {
  title: string;
  subtitle: string;
  imageUrl: string;
  ctaText: string;
  ctaUrl: string;
  bgClass: string;
  textClass: string;
  isActive: boolean;
  priority: string;
  startsAt: string;
  endsAt: string;
};

const emptyForm: BannerFormState = {
  title: '',
  subtitle: '',
  imageUrl: '',
  ctaText: '',
  ctaUrl: '',
  bgClass: 'bg-gradient-to-r from-blue-500 to-indigo-600',
  textClass: 'text-white',
  isActive: true,
  priority: '0',
  startsAt: '',
  endsAt: '',
};

const toInputValue = (value?: string | null) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toISOString().slice(0, 16);
};

const toIsoOrUndefined = (value: string) => (value ? new Date(value).toISOString() : undefined);

export const BannersPage: React.FC = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [toast, setToast] = useState({ show: false, message: '' });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [form, setForm] = useState<BannerFormState>(emptyForm);

  const orderedBanners = useMemo(
    () => [...banners].sort((a, b) => (a.priority ?? 0) - (b.priority ?? 0)),
    [banners],
  );

  const loadBanners = async (signal?: AbortSignal) => {
    try {
      const data = await adminService.getBanners(signal);
      setBanners(Array.isArray(data) ? data : []);
    } catch {
      setToast({ show: true, message: 'Unable to load banners.' });
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    loadBanners(controller.signal);
    return () => controller.abort();
  }, []);

  const openCreate = () => {
    setEditingBanner(null);
    setForm(emptyForm);
    setIsModalOpen(true);
  };

  const openEdit = (banner: Banner) => {
    setEditingBanner(banner);
    setForm({
      title: banner.title || '',
      subtitle: banner.subtitle || '',
      imageUrl: banner.imageUrl || '',
      ctaText: banner.ctaText || '',
      ctaUrl: banner.ctaUrl || '',
      bgClass: banner.bgClass || '',
      textClass: banner.textClass || '',
      isActive: banner.isActive ?? true,
      priority: String(banner.priority ?? 0),
      startsAt: toInputValue(banner.startsAt),
      endsAt: toInputValue(banner.endsAt),
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingBanner(null);
  };

  const handleSubmit = async () => {
    if (!form.title.trim() || !form.subtitle.trim()) {
      setToast({ show: true, message: 'Title and subtitle are required.' });
      return;
    }
    const payload = {
      title: form.title.trim(),
      subtitle: form.subtitle.trim(),
      imageUrl: form.imageUrl.trim(),
      ctaText: form.ctaText.trim(),
      ctaUrl: form.ctaUrl.trim(),
      bgClass: form.bgClass.trim(),
      textClass: form.textClass.trim(),
      isActive: form.isActive,
      priority: Number(form.priority || 0),
      startsAt: toIsoOrUndefined(form.startsAt),
      endsAt: toIsoOrUndefined(form.endsAt),
    };

    try {
      if (editingBanner) {
        const updated = await adminService.updateBanner(editingBanner.id, payload);
        setBanners((prev) => prev.map((item) => (item.id === editingBanner.id ? updated : item)));
      } else {
        const created = await adminService.createBanner(payload);
        setBanners((prev) => [created, ...prev]);
      }
      closeModal();
    } catch {
      setToast({ show: true, message: 'Unable to save banner.' });
    }
  };

  const handleDelete = async (banner: Banner) => {
    if (!window.confirm(`Delete banner "${banner.title}"?`)) return;
    try {
      await adminService.deleteBanner(banner.id);
      setBanners((prev) => prev.filter((item) => item.id !== banner.id));
    } catch {
      setToast({ show: true, message: 'Unable to delete banner.' });
    }
  };

  return (
    <div className="space-y-6">
      <Toast show={toast.show} message={toast.message} onClose={() => setToast({ ...toast, show: false })} />
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900">Banners</h2>
        <Button onClick={openCreate}>
          <Plus className="w-4 h-4 mr-2" /> New Banner
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableHead>Title</TableHead>
          <TableHead>CTA</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Priority</TableHead>
          <TableHead>Schedule</TableHead>
          <TableHead>Actions</TableHead>
        </TableHeader>
        <TableBody>
          {orderedBanners.map((banner) => (
            <TableRow key={banner.id}>
              <TableCell>
                <p className="font-bold text-slate-900">{banner.title}</p>
                <p className="text-xs text-slate-500">{banner.subtitle}</p>
              </TableCell>
              <TableCell>{banner.ctaText || '—'}</TableCell>
              <TableCell>
                <StatusBadge label={banner.isActive ? 'Active' : 'Inactive'} variant={banner.isActive ? 'success' : 'neutral'} />
              </TableCell>
              <TableCell>{banner.priority ?? 0}</TableCell>
              <TableCell>
                <div className="text-xs text-slate-500">
                  <div>From: {banner.startsAt ? new Date(banner.startsAt).toLocaleDateString() : '—'}</div>
                  <div>To: {banner.endsAt ? new Date(banner.endsAt).toLocaleDateString() : '—'}</div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <button className="text-primary-600 text-sm font-medium" onClick={() => openEdit(banner)}>
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button className="text-red-500 text-sm font-medium" onClick={() => handleDelete(banner)}>
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {orderedBanners.length === 0 && (
            <TableRow>
              <td className="px-4 py-6 text-center text-slate-500" colSpan={6}>
                No banners yet.
              </td>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Modal isOpen={isModalOpen} onClose={closeModal} title={editingBanner ? 'Edit Banner' : 'Create Banner'}>
        <div className="space-y-4">
          <Input label="Title" value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} />
          <Input label="Subtitle" value={form.subtitle} onChange={(event) => setForm({ ...form, subtitle: event.target.value })} />
          <Input label="Image URL" value={form.imageUrl} onChange={(event) => setForm({ ...form, imageUrl: event.target.value })} />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="CTA Text" value={form.ctaText} onChange={(event) => setForm({ ...form, ctaText: event.target.value })} />
            <Input label="CTA URL" value={form.ctaUrl} onChange={(event) => setForm({ ...form, ctaUrl: event.target.value })} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Background Class" value={form.bgClass} onChange={(event) => setForm({ ...form, bgClass: event.target.value })} />
            <Input label="Text Class" value={form.textClass} onChange={(event) => setForm({ ...form, textClass: event.target.value })} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Priority"
              type="number"
              min={0}
              value={form.priority}
              onChange={(event) => setForm({ ...form, priority: event.target.value })}
            />
            <div className="flex items-center justify-between border border-slate-200 rounded-xl px-4 py-2.5">
              <span className="text-sm text-slate-700">Active</span>
              <Switch checked={form.isActive} onCheckedChange={(checked) => setForm({ ...form, isActive: checked })} />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Starts At"
              type="datetime-local"
              value={form.startsAt}
              onChange={(event) => setForm({ ...form, startsAt: event.target.value })}
            />
            <Input
              label="Ends At"
              type="datetime-local"
              value={form.endsAt}
              onChange={(event) => setForm({ ...form, endsAt: event.target.value })}
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={closeModal}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>{editingBanner ? 'Save Changes' : 'Create Banner'}</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
