import useStore from "@/store";
import { useEffect } from "react";
import { AiOutlineCloudUpload } from "react-icons/ai";

const BatchUpload: React.FC<{
  uploader: (payload: FormData) => Promise<void>;
}> = ({ uploader }) => {
  const {
    authStore: { user, impersonated_user },
    postingStore: { loading },
    miscStore: { setSpinner },
  } = useStore();
  useEffect(() => {
    setSpinner(loading);
  }, [loading]);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files && event.target.files[0];

    if (file) {
      const formData = new FormData();

      formData.append("file", file);
      formData.append(
        "userId",
        impersonated_user?.id.toString() || user.id.toString()
      );

      await uploader(formData);
    }
  };

  return (
    <label
      htmlFor="batch"
      className="min-w-[150px] w-fit h-14 flex bg-gray-700 hover:bg-gray-600 justify-center items-center cursor-pointer transition duration-300 ease-in-out text-white text-sm py-3 px-5 rounded-md gap-2"
    >
      <input
        type="file"
        name="batch"
        id="batch"
        onChange={handleFileChange}
        className="hidden"
        accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
      />
      <AiOutlineCloudUpload className="text-xl" />
      Batch Upload
    </label>
  );
};

export default BatchUpload;
