import LegalPage from "@/components/LegalPage";
export const metadata = { title: "Free License", alternates: { canonical: "/license" } };
export default function Page() {
  return (
    <LegalPage title="PixStock License">
      <h2>You can</h2>
      <ul><li>Use images for personal and commercial projects</li><li>Modify, adapt, and edit images</li><li>Use images without attribution (attribution is appreciated but optional)</li></ul>
      <h2>You cannot</h2>
      <ul><li>Sell or redistribute the images as stock photos or in competing stock libraries, in original or modified form</li><li>Present identifiable people in a way that is defamatory or misleading</li><li>Imply endorsement by any person or brand shown in an image</li></ul>
      <p>Images are provided “as is” without warranty of any kind.</p>
    </LegalPage>
  );
}
