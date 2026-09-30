interface Props{
  params: Promise<{
    category: string;
    subcategory: string;
  }>
}

const page = async ({ params }: Props) => {
  const { category,subcategory } = await params;
  return (
    <div>
      category: {category} <br />
      Subcategory: {subcategory}
    </div>
  )
};

export default page;