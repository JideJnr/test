import MiscStore from "@/store/states/misc";
import JsFileDownloader from "js-file-downloader";

export const FilePreviewCheck = (contentType: string) => {
  if (contentType.startsWith("image/")) {
    return {
      url: "",
      preview: true,
      isPdf: false,
    };
  } else if (contentType.includes("pdf")) {
    return {
      url: "/pdf.png",
      preview: false,
      isPdf: true,
    };
  } else {
    return {
      url: "/doc.png",
      preview: false,
      isPdf: false,
    };
  }
};

export const Download = (
  url: string,
  title: string,
  fileExtension: string = "pdf"
) => {
  new JsFileDownloader({
    url,
    autoStart: true,
  })
    .then(function () {
      MiscStore().setSpinner(true);
    })
    .catch(function (error) {
      console.log(error);
    })
    .finally(() => {
      MiscStore().setSpinner(false);
    });
};
