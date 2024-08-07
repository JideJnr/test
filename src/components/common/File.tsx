import { useMemo, useState } from "react";
import { Download, FilePreviewCheck } from "@/shared/utils/file";
import { IFiles } from "@/interfaces/iCustomer";
import { Image } from "antd";
import PDFViewer from "@/components/common/PDFViewer";
import {
  AiOutlineEye,
  AiOutlineDownload,
  AiOutlineClose,
} from "react-icons/ai";

const File: React.FC<
  IFiles & {
    showDelete?: boolean;
    // onDelete: (fileName: string) => void;
  }
> = ({
  fileName,
  fileDescription,
  fileUrl,
  contentType,
  // onDelete,
  showDelete,
}) => {
  const [pdf, setPdf] = useState({
    visibility: false,
    url: "",
    title: "",
  });

  const fileProp = useMemo(
    () => FilePreviewCheck(contentType),
    [fileUrl, contentType]
  );

  const handleClick = () => {
    if (!fileProp.preview) {
      if (fileProp.isPdf) {
        setPdf({
          visibility: true,
          url: `/file/${fileName}` || fileUrl,
          title: fileDescription,
        });
      } else {
        Download(`/file${fileName}`, fileDescription);
      }
    }
  };

  const handleDelete = () => {
    // onDelete(fileName);
  };

  return (
    <>
      <div
        key={fileName}
        className={`group max-w-sm h-80 overflow-hidden border rounded-lg flex flex-col relative ${
          !fileProp.preview && "cursor-pointer"
        } relative`}
        onClick={handleClick}
      >
        {showDelete && (
          <button
            onClick={handleDelete}
            className="absolute top-2 right-2 z-50 hover:bg-opacity-80 duration-300 ease-in-out bg-red-700 text-white p-2 rounded-full"
          >
            <AiOutlineClose className="text-sm" />
          </button>
        )}
        {!fileProp.preview && (
          <div className="group-hover:bg-opacity-70 absolute top-0 bottom-0 right-0 left-0 bg-gray-950 z-40 bg-opacity-0 flex flex-col justify-center items-center transition-all duration-300 ease-in-out">
            <div className="text-white text-sm group-hover:flex items-center font-medium hidden transition duration-200 ease-in-out">
              {fileProp.isPdf ? (
                <>
                  <AiOutlineEye className="text-lg mr-2" />
                  <span>Preview</span>
                </>
              ) : (
                <>
                  <AiOutlineDownload className="text-lg mr-2" />
                  <span>Download</span>
                </>
              )}
            </div>
          </div>
        )}
        <div className="flex-1 object-cover flex flex-col justify-center items-center overflow-hidden">
          <Image
            src={fileProp.url || `/file/${fileName}`}
            alt={fileName}
            preview={fileProp.preview}
            className="h-full w-full"
          />
        </div>
        <p className="w-full flex flex-col justify-center h-12 z-50 bg-gray-100 p-2 text-sm">
          {fileDescription}
        </p>
      </div>

      <PDFViewer
        show={pdf.visibility}
        url={pdf.url}
        title={pdf.title}
        onClose={() => setPdf({ url: "", visibility: false, title: "" })}
      />
    </>
  );
};

export default File;
