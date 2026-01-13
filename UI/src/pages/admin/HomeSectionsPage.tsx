import React, { useEffect, useState } from 'react';
import { Plus, Save, Trash2 } from 'lucide-react';
import {
  Button,
  Input,
  Modal,
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
import type { HomeSection } from '@/types/domain';

type SectionDraft = {
  title: string;
  priority: string;
  isActive: boolean;
};

type SectionFormState = {
  key: string;
  title: string;
  priority: string;
  isActive: boolean;
  config: string;
};

const emptySectionForm: SectionFormState = {
  key: '',
  title: '',
  priority: '0',
  isActive: true,
  config: '',
};

export const HomeSectionsPage: React.FC = () => {
  const [sections, setSections] = useState<HomeSection[]>([]);
  const [drafts, setDrafts] = useState<Record<string, SectionDraft>>({});
  const [toast, setToast] = useState({ show: false, message: '' });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState<SectionFormState>(emptySectionForm);

  const loadSections = async (signal?: AbortSignal) => {
    try {
      const data = await adminService.getHomeSections(signal);
      setSections(Array.isArray(data) ? data : []);
      setDrafts({});
    } catch {
      setToast({ show: true, message: 'Unable to load home sections.' });
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    loadSections(controller.signal);
    return () => controller.abort();
  }, []);

  const openCreate = () => {
    setForm(emptySectionForm);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const updateDraft = (section: HomeSection, changes: Partial<SectionDraft>) => {
    setDrafts((prev) => ({
      ...prev,
      [section.id]: {
        title: changes.title ?? prev[section.id]?.title ?? section.title,
        priority: changes.priority ?? prev[section.id]?.priority ?? String(section.priority ?? 0),
        isActive: changes.isActive ?? prev[section.id]?.isActive ?? section.isActive,
      },
    }));
  };

  const saveDraft = async (section: HomeSection) => {
    const draft = drafts[section.id];
    if (!draft) return;
    try {
      const updated = await adminService.updateHomeSection(section.id, {
        title: draft.title,
        priority: Number(draft.priority || 0),
        isActive: draft.isActive,
      });
      setSections((prev) => prev.map((item) => (item.id === section.id ? updated : item)));
      setDrafts((prev) => {
        const { [section.id]: _, ...rest } = prev;
        return rest;
      });
    } catch {
      setToast({ show: true, message: 'Unable to update home section.' });
    }
  };

  const toggleActive = async (section: HomeSection, value: boolean) => {
    updateDraft(section, { isActive: value });
    try {
      const updated = await adminService.updateHomeSection(section.id, { isActive: value });
      setSections((prev) => prev.map((item) => (item.id === section.id ? updated : item)));
      setDrafts((prev) => {
        const { [section.id]: _, ...rest } = prev;
        return rest;
      });
    } catch {
      setToast({ show: true, message: 'Unable to update home section.' });
    }
  };

  const handleCreate = async () => {
    if (!form.key.trim() || !form.title.trim()) {
      setToast({ show: true, message: 'Key and title are required.' });
      return;
    }
    let parsedConfig: unknown = undefined;
    if (form.config.trim()) {
      try {
        parsedConfig = JSON.parse(form.config);
      } catch {
        setToast({ show: true, message: 'Config must be valid JSON.' });
        return;
      }
    }
    try {
      const created = await adminService.createHomeSection({
        key: form.key.trim(),
        title: form.title.trim(),
        priority: Number(form.priority || 0),
        isActive: form.isActive,
        config: parsedConfig,
      });
      setSections((prev) => [created, ...prev]);
      closeModal();
    } catch {
      setToast({ show: true, message: 'Unable to create home section.' });
    }
  };

  const handleDelete = async (section: HomeSection) => {
    if (!window.confirm(`Delete section "${section.title}"?`)) return;
    try {
      await adminService.deleteHomeSection(section.id);
      setSections((prev) => prev.filter((item) => item.id !== section.id));
    } catch {
      setToast({ show: true, message: 'Unable to delete home section.' });
    }
  };

  return (
    <div className="space-y-6">
      <Toast show={toast.show} message={toast.message} onClose={() => setToast({ ...toast, show: false })} />
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900">Home Sections</h2>
        <Button onClick={openCreate}>
          <Plus className="w-4 h-4 mr-2" /> New Section
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableHead>Key</TableHead>
          <TableHead>Title</TableHead>
          <TableHead>Priority</TableHead>
          <TableHead>Active</TableHead>
          <TableHead>Actions</TableHead>
        </TableHeader>
        <TableBody>
          {sections.map((section) => {
            const draft = drafts[section.id] || {
              title: section.title,
              priority: String(section.priority ?? 0),
              isActive: section.isActive,
            };
            return (
              <TableRow key={section.id}>
                <TableCell className="font-semibold text-slate-900">{section.key}</TableCell>
                <TableCell>
                  <Input
                    value={draft.title}
                    onChange={(event) => updateDraft(section, { title: event.target.value })}
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    min={0}
                    value={draft.priority}
                    onChange={(event) => updateDraft(section, { priority: event.target.value })}
                  />
                </TableCell>
                <TableCell>
                  <Switch checked={draft.isActive} onCheckedChange={(checked) => toggleActive(section, checked)} />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => saveDraft(section)}
                    >
                      <Save className="w-4 h-4 mr-1" /> Save
                    </Button>
                    <button className="text-red-500 text-sm font-medium" onClick={() => handleDelete(section)}>
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
          {sections.length === 0 && (
            <TableRow>
              <td className="px-4 py-6 text-center text-slate-500" colSpan={5}>
                No home sections yet.
              </td>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Modal isOpen={isModalOpen} onClose={closeModal} title="Create Home Section">
        <div className="space-y-4">
          <Input label="Key" value={form.key} onChange={(event) => setForm({ ...form, key: event.target.value })} />
          <Input label="Title" value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} />
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
          <Input
            label="Config (JSON)"
            placeholder='{"limit":3}'
            value={form.config}
            onChange={(event) => setForm({ ...form, config: event.target.value })}
          />
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={closeModal}>
              Cancel
            </Button>
            <Button onClick={handleCreate}>Create Section</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
