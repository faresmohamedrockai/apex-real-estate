import InventoryDetailsPage from '@/app/[locale]/components/Inventories/InventoryDetailsPage';

const getInventory = async (id: string) => {
  const res = await fetch(`http://localhost:3000/api/inventories/${id}`);
  const json = await res.json();

  if (!json.success) throw new Error('لم يتم العثور على الوحدة');
  return json.data;
};

export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id;
  const data = await getInventory(id);

  return <InventoryDetailsPage data={data} />;
}
