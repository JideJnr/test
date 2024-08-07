import { Select, Modal, message } from "antd";
import Button from "@/components/common/Button";
import PageTitle from "@/components/common/PageTitle";
import { IModal } from "@/interfaces/iModal";
import { Controller, useForm } from "react-hook-form";
import useStore from "@/store";
import ModalClose from "../common/ModalClose";
import { IChangeOfficer } from "@/interfaces/iCustomer";
import { useEffect } from "react";

export const SwitchOfficerModal: React.FC<
  IModal & {
    customerId: string;
  }
> = ({ show, onClose, customerId }) => {
  const {
    locationStore: {
      locations,
      officers,
      getOfficers,
      changeOfficer,
      processing,
      message: msg,
      clearErrorAndMessage,
      error,
    },
    customerStore: { getCustomer },
  } = useStore();
  const {
    handleSubmit,
    control,
    watch,
    resetField,
    formState: { isValid },
  } = useForm<
    IChangeOfficer & {
      location: number;
    }
  >({
    mode: "onChange",
    defaultValues: {
      customerId,
    },
  });
  const watchLocation = watch("location", null);
  const onSubmit = async (data: IChangeOfficer) => {
    await changeOfficer(data);
  };

  useEffect(() => {
    if (watchLocation) {
      getOfficers(watchLocation);
      resetField("officerId", {
        keepTouched: true,
      });
    }
  }, [watchLocation]);

  useEffect(() => {
    return () => {
      onClose();
    };
  }, []);

  useEffect(() => {
    if (msg) {
      onClose();
      getCustomer(+customerId);
      message.success(msg);
    }

    if (error) {
      message.error(error);
    }

    return () => {
      clearErrorAndMessage();
    };
  }, [error, msg, clearErrorAndMessage]);

  return (
    <Modal
      closeIcon={<ModalClose />}
      open={show}
      onCancel={onClose}
      closable={!processing}
      maskClosable={!processing}
      footer={null}
      title={
        <PageTitle
          showAdd={false}
          showSearch={false}
          isModal
          title={"Change Account Officer"}
          subTitle={`Change account officer for customer`}
        />
      }
    >
      <form
        method="POST"
        className="flex flex-col md:min-h-[400px]"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="w-full mb-6">
          <label htmlFor="location" className="block mb-1">
            Location
          </label>
          <Controller
            name="location"
            control={control}
            rules={{
              required: true,
            }}
            render={({ field }) => (
              <Select
                id="location"
                size="large"
                showSearch
                filterOption={(input, option) =>
                  option.label?.toLowerCase().includes(input?.toLowerCase())
                }
                className="w-full"
                placeholder="Select Location"
                options={locations.map((location) => ({
                  label: location.name,
                  value: location.id,
                }))}
                {...field}
              ></Select>
            )}
          />
        </div>
        <div className="w-full">
          <label htmlFor="officerId" className="block mb-1">
            Account Officer
          </label>
          <Controller
            name="officerId"
            control={control}
            rules={{
              required: true,
            }}
            render={({ field }) => (
              <Select
                id="officerId"
                size="large"
                className="w-full"
                showSearch
                filterOption={(input, option) =>
                  option.label?.toLowerCase().includes(input?.toLowerCase())
                }
                placeholder="Select Officer"
                options={officers.map((officer) => ({
                  label: `${officer.firstName} ${officer.lastName}`,
                  value: officer.id,
                }))}
                {...field}
              ></Select>
            )}
          />
        </div>
        <div className="mb-3 mt-auto flex gap-4 justify-end items-center">
          <a
            onClick={() => onClose()}
            className="text-red-600 hover:text-red-700 w-24"
          >
            Close
          </a>
          <Button
            title="Change Officer"
            type="primary"
            size="medium"
            disabled={!isValid || processing}
            forForm
            isLoading={processing}
          />
        </div>
      </form>
    </Modal>
  );
};
