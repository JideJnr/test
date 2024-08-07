import { Modal } from "antd";
import { Viewer } from "@react-pdf-viewer/core";
import { IModal } from "@/interfaces/iModal";

import "@react-pdf-viewer/core/lib/styles/index.css";
import PageTitle from "@/components/common/PageTitle";
import Button from "@/components/common/Button";
import { Download } from "@/shared/utils/file";
import ModalClose from "./ModalClose";

const PDFViewer: React.FC<
  IModal & {
    url?: string;
    title?: string;
  }
> = ({ url, show, onClose, title }) => {
  return (
    <>
      <Modal
        closeIcon={<ModalClose />}
        style={{ top: 20 }}
        footer={null}
        title={
          <PageTitle
            showAdd={false}
            showSearch={false}
            isModal
            title={title || "Document"}
          />
        }
        open={show}
        width={1000}
        onCancel={() => onClose()}
      >
        <div className="md:h-[calc(100vh-200px)] overflow-y-auto">
          <Viewer fileUrl={url} />
        </div>
        <div className="w-full mt-4 flex justify-end">
          <Button
            title="Download"
            onClick={(e) => {
              e.preventDefault();

              Download(url, title, "pdf");
            }}
            size="medium"
          />
        </div>
      </Modal>
    </>
  );
};

export default PDFViewer;
