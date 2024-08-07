import Button from "@/components/common/Button";
import { StepPropType } from "@/types/misc";
import { useEffect, useState } from "react";
import FileUpload from "@/components/common/FileUpload";
import useStore from "@/store";
import { ICustomer, IFiles } from "@/interfaces/iCustomer";
import File from "@/components/common/File";
import ApiService from "@/services/api";
import { message } from "antd";

const StepFive: React.FC<StepPropType> = ({
  next,
  previous,
  data,
  setFormData,
}) => {
  const { customerStore } = useStore();
  const { processing } = customerStore;
  const [files, setFiles] = useState<IFiles[]>(data.files || []);

  useEffect(() => {
    if (data && data.files && data.files.length > 0) {
      setFiles(data.files);
    }
  }, [data]);

  useEffect(() => {
    setFormData({ ...data, files: files } as ICustomer);
  }, [files]);

  const handleNewFile = (data: any) => {
    if (data) {
      setFiles([...files, data]);
    }
  };

  const handleSubmit = () => {
    setFormData({ ...data, files: files } as ICustomer);
    next();
  };

  const handleFileDelete = async (fileName: string) => {
    setFiles((prev) => prev.filter((file) => file.fileName !== fileName));

    const api = new ApiService();
    const { data } = await api.RemoveFile(fileName);

    message.success("File deleted successfully");
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

      <div className="mt-12 md:mt-auto text-end flex items-center gap-3 justify-end">
        <Button
          title={"Back"}
          onClick={() => {
            previous();
          }}
          type="default"
          disabled={processing}
          size="large"
        />

        <Button
          title={"Submit"}
          onClick={() => {
            handleSubmit();
          }}
          isLoading={processing}
          disabled={processing || files.length === 0}
          type="primary"
          size="large"
        />
      </div>
    </div>
  );
};

export default StepFive;
