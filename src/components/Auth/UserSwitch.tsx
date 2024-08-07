import StringFormat from "@/shared/utils/string";
import useStore from "@/store";
import Button from "../common/Button";
import { Controller, useForm } from "react-hook-form";
import { IModal } from "@/interfaces/iModal";
import { useEffect } from "react";
import ModalClose from "../common/ModalClose";
import { Modal, Select } from "antd";
import PageTitle from "../common/PageTitle";

export const ImpersonatedUser: React.FC = () => {
  const {
    authStore: { stopImpersonation, impersonated_user },
    miscStore: { setSpinner },
  } = useStore();

  return (
    <div className="flex bg-blue-100 h-20 justify-between items-center px-8">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-blue-50 text-sm font-bold rounded-full border flex justify-center items-center">
          {`${StringFormat.getCharacter(
            impersonated_user?.firstName,
            1
          )}${StringFormat.getCharacter(impersonated_user?.lastName, 1)}`}
        </div>
        <div className="hidden md:inline">
          <h4 className="text-sm font-semibold">
            {impersonated_user?.firstName} {impersonated_user?.lastName}
          </h4>
          {impersonated_user.role && (
            <p className="text-xs font-medium">
              {StringFormat.toTitleCase(impersonated_user.role)}
            </p>
          )}
        </div>
      </div>

      <Button
        title="Switch Back"
        type="danger"
        size="large"
        onClick={async () => {
          setSpinner(true);
          await new Promise((resolve) => setTimeout(resolve, 2000));
          stopImpersonation();
          setSpinner(false);
        }}
      />
    </div>
  );
};

export const UserSwitcherModal: React.FC<IModal> = ({ show, onClose }) => {
  const {
    handleSubmit,
    control,
    formState: { isDirty, isValid },
    reset,
  } = useForm<{
    userId: number | string;
  }>({
    mode: "onChange",
  });
  const {
    userStore: { getUsers, users },
    miscStore: { setSpinner },
    authStore: { impersonateUser, authLoading },
  } = useStore();

  useEffect(() => {
    if (users && users.length === 0) {
      getUsers();
    }
  }, [users]);

  useEffect(() => {
    setSpinner(authLoading);
  }, [authLoading]);

  const onSubmit = async (formData: { userId: number | string }) => {
    onClose();
    await impersonateUser(formData.userId);
    reset();
  };

  return (
    <Modal
      closeIcon={<ModalClose />}
      open={show}
      onCancel={onClose}
      footer={null}
      title={
        <PageTitle
          showAdd={false}
          showSearch={false}
          isModal
          title={"Switch User"}
          subTitle={"Assume user identity"}
        />
      }
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-12">
          <label htmlFor="userId" className="block mb-2">
            Target user
          </label>
          <Controller
            name="userId"
            control={control}
            rules={{
              required: true,
            }}
            render={({ field }) => (
              <Select
                id="userId"
                size="large"
                className="w-full"
                showSearch
                placeholder="Select user"
                filterOption={(input, option) =>
                  option.label?.toLowerCase().includes(input?.toLowerCase())
                }
                options={users
                  .map((user) => {
                    if (user?.active === true && user?.role) {
                      return {
                        label: `${user.firstName} ${user.lastName}`,
                        value: user.id,
                      };
                    }

                    return null;
                  })
                  .filter(Boolean)
                  .sort((a, b) => {
                    if (a && b) {
                      return a.label.localeCompare(b.label);
                    }

                    return 0;
                  })}
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
            title="Switch"
            type="primary"
            size="large"
            disabled={!isDirty || !isValid}
            forForm
          />
        </div>
      </form>
    </Modal>
  );
};
