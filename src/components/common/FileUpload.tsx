import { message, Modal } from "antd";
import { IFiles } from "@/interfaces/iCustomer";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { RiAddLine } from "react-icons/ri";
import ApiService from "@/services/api";
import Button from "@/components/common/Button";
import PageTitle from "@/components/common/PageTitle";
import { LoadingOutlined } from "@ant-design/icons";
import ModalClose from "./ModalClose";

const apiService = new ApiService();

const FileUpload: React.FC<{
  onDone: (response: any) => void;
  editFileName?: boolean;
  useExternalApi?: boolean;
  externalAPI?: (file: FormData) => Promise<any>;
  fileName?: string;
}> = ({ onDone, editFileName, fileName, useExternalApi, externalAPI }) => {
  const [progress, setProgress] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState<string>("");
  const [currentFile, setCurrentFile] = useState<any>(null);

  useEffect(() => {
    if (name) {
      upload();
    }
  }, [name]);

  const upload = () => {
    setShowModal(false);
    setError("");

    if (currentFile) {
      const formData = new FormData();

      formData.append("file", currentFile);
      formData.append("fileName", name);

      setProgress(true);

      if (useExternalApi && externalAPI) {
        externalAPI(formData)
          .then((data) => {
            onDone(data);
          })
          .catch((error) => {
            setProgress(false);
            setError("File upload error!");
            onDone(null);
          })
          .finally(() => {
            setProgress(false);
            setCurrentFile(null);
          });

        return;
      }

      apiService
        .FileUploadUniRest(formData)
        .then((data) => {
          onDone({
            ...data.data,
            fileUrl: `/file/${data.data.fileName}`,
          });
        })
        .catch((error) => {
          setProgress(false);
          setError("File upload error!");
          onDone(null);
        })
        .finally(() => {
          setProgress(false);
          setCurrentFile(null);
        });
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];

    if (file) {
      if (
        file.type === "image/jpeg" ||
        file.type === "image/png" ||
        file.type === "application/pdf"
      ) {
        if (file.size > 8000000) {
          setError("File size should not exceed 8MB.");
          return;
        }

        setCurrentFile(file);

        if (editFileName) {
          setShowModal(true);
        } else {
          setName(fileName || file.name);
        }
      } else {
        setError("Only image (JPEG, PNG) and PDF files are allowed.");
      }
    }
  };

  return (
    <>
      <label
        className={`rounded-lg bg-gray-100 hover:border-blue-700 max-w-sm h-80 border border-dashed flex flex-col justify-center items-center ${
          progress ? "pointer-events-none" : "cursor-pointer"
        } ${error && "border-red-600"}`}
      >
        <input
          type="file"
          accept=".jpg,.jpeg,.png,.pdf"
          className="hidden"
          onChange={handleFileChange}
          disabled={progress}
        />
        <div className="flex items-center">
          {progress && <LoadingOutlined />}
          {error && <p>{error}</p>}
          {!progress && !error && (
            <div className="flex flex-col gap-6 items-center">
              <RiAddLine className="text-2xl" />
              <div className="p-4 text-center">
                <p>Upload</p>
                <p className="text-xs italic text-gray-500 ">
                  Maximum file size is 8MB.
                </p>
              </div>
            </div>
          )}
        </div>
      </label>

      <FileNameModal
        show={showModal}
        onClose={() => {
          setCurrentFile(null);
          setShowModal(false);
        }}
        setName={setName}
      />
    </>
  );
};

export default FileUpload;

export const FileNameModal: React.FC<any> = ({ show, onClose, setName }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isValid },
  } = useForm<{
    name: string;
  }>({
    mode: "onChange",
  });

  useEffect(() => {
    return () => {
      reset();
    };
  }, [show]);

  const onSubmit = (form: { name: string }) => {
    setName(form.name);
  };

  return (
    <>
      <Modal
        open={show}
        onCancel={onClose}
        footer={null}
        closeIcon={<ModalClose />}
        title={
          <PageTitle
            showAdd={false}
            showSearch={false}
            isModal
            title={"File Name"}
          />
        }
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="">
            <label htmlFor="name" className="block mb-2">
              File name
            </label>
            <input
              type="text"
              id="name"
              autoComplete="off"
              {...register("name", { required: true })}
              className="form-input w-full"
              placeholder="Enter file name"
            />
          </div>

          <div className="mb-3 mt-12 flex gap-4 justify-end items-center">
            <a
              onClick={() => {
                message.error("File dismissed");

                onClose();
              }}
              className="text-red-600 hover:text-red-700 w-24"
            >
              Close
            </a>
            <Button
              disabled={!isValid}
              title="Submit"
              forForm
              type="primary"
              size="medium"
            />
          </div>
        </form>
      </Modal>
    </>
  );
};
