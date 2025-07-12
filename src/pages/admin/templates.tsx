import AdminLayout from '@/components/admin/AdminLayout';
import TemplateManager from '@/components/template/TemplateManager';
import { Template } from '@/types/template';

export default function Templates() {
  const handleEditTemplate = (template: Template) => {
    // In a real app, this would navigate to a template editor
    console.log('Edit template:', template);
    alert(`템플릿 편집 기능은 곧 구현될 예정입니다: ${template.name}`);
  };

  const handleViewTemplate = (template: Template) => {
    // In a real app, this would show a preview modal
    console.log('View template:', template);
    alert(`템플릿 미리보기 기능은 곧 구현될 예정입니다: ${template.name}`);
  };

  return (
    <AdminLayout>
      <TemplateManager
        onEdit={handleEditTemplate}
        onView={handleViewTemplate}
      />
    </AdminLayout>
  );
}