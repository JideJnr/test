import { Modal, Dropdown, message, Select, Avatar } from "antd";
import React, { useEffect, useState } from "react";
import Button from "@/components/common/Button";
import PageTitle from "@/components/common/PageTitle";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { IModal } from "@/interfaces/iModal";
import type { MenuProps } from "antd";
import { useParams } from "react-router-dom";
import {
  IUser,
  IUserFormPayload,
  SystemRoles,
} from "@/interfaces/iUserManagement";
import { Controller, useForm } from "react-hook-form";
import useStore from "@/store";
import { SystemRole } from "@/shared/utils/constants";
import StringFormat from "@/shared/utils/string";
import ModalClose from "@/components/common/ModalClose";
import Alert from "@/shared/utils/alert";

const UserUpsert: React.FC = () => {
  const {
    userStore,
    miscStore: { setSpinner },
  } = useStore();
  const {
    getUser,
    fetchingOne,
    processing,
    changeUserStatus,
    user,
    error,
    message: msg,
    clearErrorAndMessage,
  } = userStore;

  const params = useParams();
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [showLocationModal, setShowLocationModal] = useState<boolean>(false);
  const [showRoleModal, setShowRoleModal] = useState<boolean>(false);

  useEffect(() => {
    const id = params["id"];

    if (id) getUser(id);

    return () => {
      setShowEditModal(false);
    };
  }, []);

  useEffect(() => {
    setSpinner(processing || fetchingOne);
  }, [processing, fetchingOne]);

  useEffect(() => {
    if (msg) {
      message.success(msg);

      setShowEditModal(false);
      setShowLocationModal(false);
      setShowRoleModal(false);

      const id = params["id"];

      if (id) getUser(id);
    }

    if (error) {
      message.error(error);
    }

    return () => {
      clearErrorAndMessage();
    };
  }, [error, msg, clearErrorAndMessage]);

  const items: MenuProps["items"] = [
    {
      label: <a onClick={() => setShowEditModal(true)}>Edit User</a>,
      key: "0",
    },
    {
      label: <a onClick={() => setShowLocationModal(true)}>Change Location</a>,
      key: "1",
    },
    {
      label: <a onClick={() => setShowRoleModal(true)}>Change Role</a>,
      key: "2",
    },
    {
      label: (
        <a onClick={() => handleToggleUserStatus(user?.active)}>
          {!user?.active ? "Activate" : "Deactivate"}
        </a>
      ),
      key: "3",
    },
  ];

  const handleToggleUserStatus = (status: boolean) => {
    Alert.confirm(
      "Are you sure",
      `You want to ${!status ? "activate" : "deactivate"} user`,
      async (res) => {
        if (res.isConfirmed) {
          await changeUserStatus(user?.id, !user?.active);
        }
      }
    );
  };

  return (
    <div>
      <PageTitle
        title="User"
        subTitle="Edit all information about this system user"
        showAdd={false}
        showSearch={false}
        showBackButton={true}
        backButtonRoute="/account/settings/user-management"
      />

      <div className="p-2 flex flex-col gap-12">
        {user ? (
          <>
            <div className="flex flex-col md:flex-row gap-6 justify-between">
              <Avatar
                size={{
                  xs: 64,
                  sm: 64,
                  md: 64,
                  lg: 64,
                  xl: 80,
                  xxl: 80,
                }}
              >
                {`${StringFormat.getCharacter(
                  user?.firstName,
                  1
                )}${StringFormat.getCharacter(user?.lastName, 1)}`}
              </Avatar>

              <Dropdown menu={{ items }} trigger={["click"]}>
                <Button
                  title={
                    <p className="flex items-center justify-between text-sm gap-2">
                      Action
                      <BiDotsVerticalRounded />
                    </p>
                  }
                  size="small"
                  type="default"
                  onClick={(e) => e.preventDefault()}
                  className="hidden md:inline"
                />
              </Dropdown>
            </div>
            <div className="border rounded-lg p-6 mb-6">
              <p className="uppercase mb-4 text-sm text-gray-500">Details</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm font-semibold text-blue-700 mb-2">
                    First Name
                  </p>
                  <h3 className="text-sm text-medium">
                    {user.firstName || "--"}
                  </h3>
                </div>
                <div>
                  <p className="text-sm font-semibold text-blue-700 mb-2">
                    Last Name
                  </p>
                  <h3 className="text-sm text-medium">
                    {user.lastName || "--"}
                  </h3>
                </div>
                <div>
                  <p className="text-sm font-semibold text-blue-700 mb-2">
                    Role
                  </p>
                  <h3 className="text-sm text-medium">
                    {StringFormat.toTitleCase(user.role) || "--"}
                  </h3>
                </div>
                <div>
                  <p className="text-sm font-semibold text-blue-700 mb-2">
                    Status
                  </p>
                  <h3 className="text-sm text-medium">
                    {user.active ? "Active" : "Inactive"}
                  </h3>
                </div>
                <div>
                  <p className="text-sm font-semibold text-blue-700 mb-2">
                    Staff ID
                  </p>
                  <h3 className="text-sm text-medium">{user.id || "--"}</h3>
                </div>
                <div>
                  <p className="text-sm font-semibold text-blue-700 mb-2">
                    Email
                  </p>
                  <h3 className="text-sm text-medium">{user.email || "--"}</h3>
                </div>
                <div>
                  <p className="text-sm font-semibold text-blue-700 mb-2">
                    Phone
                  </p>
                  <h3 className="text-sm text-medium">{user.phone || "--"}</h3>
                </div>
                {user.location && (
                  <div>
                    <p className="text-sm font-semibold text-blue-700 mb-2">
                      Location
                    </p>
                    <h3 className="text-sm text-medium">
                      {user.location.name || "--"}
                    </h3>
                  </div>
                )}
              </div>
            </div>
          </>
        ) : null}
      </div>

      <UserUpsertModal
        show={showEditModal}
        user={user}
        onClose={() => setShowEditModal(false)}
      />

      <LocationUpsert
        show={showLocationModal}
        onClose={() => setShowLocationModal(false)}
      />

      <RoleUpsert
        show={showRoleModal}
        onClose={() => setShowRoleModal(false)}
      />
    </div>
  );
};

export default UserUpsert;

export const UserUpsertModal: React.FC<IModal & { user?: IUser | null }> = ({
  show,
  onClose,
  user,
}) => {
  const { userStore } = useStore();
  const { upsertUser, processing } = userStore;
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isDirty, isValid },
  } = useForm<IUserFormPayload>({
    mode: "onChange",
  });

  useEffect(() => {
    setValue("email", user?.email, { shouldValidate: true, shouldDirty: true });
    setValue("firstName", user?.firstName, {
      shouldValidate: true,
      shouldDirty: true,
    });
    setValue("lastName", user?.lastName, {
      shouldValidate: true,
      shouldDirty: true,
    });
    setValue("phone", user?.phone, { shouldValidate: true, shouldDirty: true });

    return () => {
      reset();
    };
  }, [user]);

  const onSubmit = async (data: IUserFormPayload) => {
    await upsertUser({ ...user, ...data });
  };

  return (
    <>
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
            title={user?.id ? "Update User" : "Add User"}
            subTitle={`${user?.id ? "Update" : "Create new"} system user`}
          />
        }
      >
        <form
          method="POST"
          className="flex flex-col md:min-h-[500px]"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="">
            <div className="mb-6">
              <label htmlFor="firstName" className="block mb-2">
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                {...register("firstName")}
                className="form-input w-full"
                placeholder="Ex. John"
              />
            </div>
            <div className="mb-6">
              <label htmlFor="lastName" className="block mb-2">
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                {...register("lastName")}
                className="form-input w-full"
                placeholder="Ex. Doe"
              />
            </div>
            <div className="mb-6">
              <label htmlFor="emailAddress" className="block mb-2">
                Email
              </label>
              <input
                type="email"
                inputMode="email"
                {...register("email")}
                id="emailAddress"
                className="form-input w-full"
                placeholder="Ex. johndoe@email.com"
              />
            </div>
            <div className="mb-6">
              <label htmlFor="phoneNumber" className="block mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                inputMode="tel"
                id="phoneNumber"
                {...register("phone")}
                className="form-input w-full"
                placeholder="Ex. +2348012345678"
              />
            </div>
          </div>
          <div className="mb-3 mt-auto flex gap-4 justify-end items-center">
            <a
              onClick={() => onClose()}
              className="text-red-600 hover:text-red-700 w-24"
            >
              Close
            </a>
            <Button
              title={user?.id ? "Update User" : "Create User"}
              type="primary"
              size="large"
              disabled={!isDirty || !isValid || processing}
              forForm
              isLoading={processing}
            />
          </div>
        </form>
      </Modal>
    </>
  );
};

export const LocationUpsert: React.FC<IModal> = ({ show, onClose }) => {
  const {
    handleSubmit,
    setValue,
    control,
    formState: { isDirty, isValid },
  } = useForm<{
    location: string | number;
  }>({
    mode: "onChange",
  });
  const {
    locationStore: { locations, getLocations },
    userStore: { processing, assignLocation, user },
  } = useStore();

  useEffect(() => {
    getLocations();
  }, []);

  useEffect(() => {
    if (user && user.location) {
      setValue("location", user.location.id, { shouldValidate: true });
    }
  }, [user]);

  const onSubmit = async (formData: { location: string | number }) => {
    await assignLocation({
      locationId: formData.location,
      userId: user?.id,
    });
  };

  return (
    <>
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
            title={"Change Location"}
            subTitle={"Assign new location to the system user"}
          />
        }
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="">
            <label htmlFor="acctLocation" className="block mb-2">
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
                  id="role"
                  size="large"
                  showSearch
                  filterOption={(input, option) =>
                    option.label?.toLowerCase().includes(input?.toLowerCase())
                  }
                  className="w-full "
                  placeholder="Select Location"
                  options={locations.map((location) => ({
                    label: StringFormat.toTitleCase(location.name),
                    value: location.id,
                  }))}
                  {...field}
                ></Select>
              )}
            />
          </div>

          <div className="mb-3 mt-12 flex gap-4 justify-end items-center">
            <a
              onClick={() => onClose()}
              className="text-red-600 hover:text-red-700 w-24"
            >
              Close
            </a>
            <Button
              title="Change"
              type="primary"
              size="large"
              disabled={!isDirty || !isValid || processing}
              forForm
              isLoading={processing}
            />
          </div>
        </form>
      </Modal>
    </>
  );
};

export const RoleUpsert: React.FC<IModal> = ({ show, onClose }) => {
  const {
    handleSubmit,
    setValue,
    control,
    formState: { isDirty, isValid },
  } = useForm<{
    roleType: SystemRoles;
  }>({
    mode: "onChange",
  });
  const {
    userStore,
    authStore: { user: originalUser, impersonated_user },
  } = useStore();
  const [authUser, setAuthUser] = useState<IUser>(
    impersonated_user || originalUser
  );
  const { processing, assignRole, user } = userStore;

  useEffect(() => {
    setAuthUser(impersonated_user || originalUser);
  }, [impersonated_user, originalUser]);

  useEffect(() => {
    if (user && user.role) {
      setValue("roleType", user.role, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  }, [user]);

  const onSubmit = async (formData: { roleType: SystemRoles }) => {
    await assignRole(formData.roleType, user?.id as number);
  };

  return (
    <>
      <Modal
        closeIcon={<ModalClose />}
        open={show}
        closable={!processing}
        maskClosable={!processing}
        onCancel={onClose}
        footer={null}
        title={
          <PageTitle
            showAdd={false}
            showSearch={false}
            isModal
            title={"Change Role"}
            subTitle={"Change system user role"}
          />
        }
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-12">
            <label htmlFor="role" className="block mb-2">
              Role
            </label>
            <Controller
              name="roleType"
              control={control}
              rules={{
                required: true,
              }}
              render={({ field }) => (
                <Select
                  id="role"
                  size="large"
                  className="w-full"
                  placeholder="Select Role"
                  showSearch
                  filterOption={(input, option) =>
                    option.label?.toLowerCase().includes(input?.toLowerCase())
                  }
                  options={SystemRole.map((role) => {
                    if (
                      authUser?.role === "SUPER_ADMINISTRATOR" ||
                      role !== "SUPER_ADMINISTRATOR"
                    ) {
                      return {
                        label: StringFormat.toTitleCase(role),
                        value: role,
                      };
                    }

                    return null;
                  }).filter(Boolean)}
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
              title="Change"
              type="primary"
              size="large"
              disabled={!isDirty || !isValid || processing}
              forForm
              isLoading={processing}
            />
          </div>
        </form>
      </Modal>
    </>
  );
};
