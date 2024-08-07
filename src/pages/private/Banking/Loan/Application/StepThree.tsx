import Button from "@/components/common/Button";
import FileUpload from "@/components/common/FileUpload";
import { IFiles } from "@/interfaces/iCustomer";
import { useEffect, useState } from "react";
import { ILoan } from "@/interfaces/iLoan";
import useStore from "@/store";
import PDFViewer from "@/components/common/PDFViewer";
import File from "@/components/common/File";

const StepThree: React.FC<{
  next: () => void;
  previous: () => void;
  setFormData: (data: ILoan) => void;
  data: Partial<ILoan>;
}> = ({ next, previous, data, setFormData }) => {
  const {
    loanStore: { processing },
  } = useStore();
  const [files, setFiles] = useState<IFiles[]>(data.files || []);
  const [pdf, setPdf] = useState<{
    visibility: boolean;
    url: string;
    title: string;
  }>({
    visibility: false,
    url: "",
    title: "",
  });

  useEffect(() => {
    if (data && data.files && data.files.length > 0) {
      setFiles(data.files);
    }
  }, [data]);

  useEffect(() => {
    setFormData({ ...data, files: files } as ILoan);
  }, [files]);

  const handleNewFile = (data: any) => {
    if (data) {
      setFiles([...files, data]);
    }
  };

  const handleSubmit = () => {
    setFormData({ ...data, files: files } as ILoan);
    next();
  };

  const handleFileDelete = (fileName: string) => {
    // TODO:// Add delete file API call here

    setFiles((prev) => prev.filter((file) => file.fileName !== fileName));
    // setFormData({ ...data, files: files } as ICustomer);
  };

  return (
    <div className="flex flex-col min-h-[600px]">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
        {files.map((file) => (
          <File
            key={file.fileName}
            // showDelete={false}
            // onDelete={handleFileDelete}
            {...file}
          />
        ))}

        <FileUpload onDone={handleNewFile} editFileName />
      </div>

      <div className="mt-auto text-end flex items-center gap-3 justify-end">
        <Button
          title={"Back"}
          onClick={() => {
            previous();
          }}
          type="default"
          size="large"
        />

        <Button
          title={"Submit"}
          onClick={() => {
            handleSubmit();
          }}
          disabled={processing || files.length === 0}
          isLoading={processing}
          type="primary"
          size="large"
        />
      </div>

      <PDFViewer
        show={pdf.visibility}
        url={pdf.url}
        title={pdf.title}
        onClose={() => setPdf({ url: "", visibility: false, title: "" })}
      />
    </div>
  );
};

export default StepThree;
