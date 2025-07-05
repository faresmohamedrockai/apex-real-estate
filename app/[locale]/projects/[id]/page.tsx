import ProjectDetailsPage from '@/app/[locale]/components/Projects/ProjectDetailsPage';

const getProject = async (id: string) => {
  const res = await fetch(`http://localhost:3000/api/projects/${id}`);
  const json = await res.json();

  if (!json.success) throw new Error('لم يتم العثور على المشروع');
  return json.data;
};

export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id;
  const data = await getProject(id);

  return <ProjectDetailsPage data={data} />;
} 