import React, { useEffect, useState } from "react";
import PageTitle from "@/components/common/PageTitle";
import { Modal, Switch, Table, message, Dropdown, Menu } from "antd";
import type { TableProps } from "antd/es/table";
import { IModal } from "@/interfaces/iModal";
import Button from "@/components/common/Button";
import { IModule } from "@/interfaces/iModules";
import useModuleStore from "@/store/states/module";
import ModalClose from "@/components/common/ModalClose";

const columns: any = [
  {
    title: "ID",
    dataIndex: "id",
  },
  {
    title: "Name",
    dataIndex: "name",
    sorter: (a: any, b: any) => a.name!.length - b.name!.length,
    sortDirections: ["descend"],
  },
  {
    title: "Enabled",
    dataIndex: "isActive",
  },
  {
    title: "Actions",
    dataIndex: "actions",
    key: "actions",
    render: (_: any, record: IModule) => (
      <Dropdown
        overlay={getMenu(record)}
        trigger={["click"]}
        placement="bottomRight"
      >
        <a className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
          Actions
        </a>
      </Dropdown>
    ),
  },
];

const getMenu = (record: IModule) => (
  <Menu>
    <Menu.Item key="edit" onClick={() => {}}>
      Edit
    </Menu.Item>
    <Menu.Item key="delete" onClick={() => {}}>
      Delete
    </Menu.Item>
  </Menu>
);

const onChange: TableProps<IModule>["onChange"] = (
  pagination,
  filters,
  sorter,
  extra
) => {};

const SystemModule: React.FC = () => {
  const { getModules, modules, setModuleValue } = useModuleStore();
  const [sortedModules, setSortedModules] = useState<IModule[]>();
  const [showUpsertModal, setShowUpsertModal] = useState<boolean>(false);

  useEffect(() => {
    getModules();

    return () => {
      setModuleValue("error", "");
      setModuleValue("message", "");
    };
  }, []);

  useEffect(() => {
    const updatedUsers = modules.map((module, index) => {
      return { ...module, key: index };
    });

    setSortedModules(updatedUsers);
  }, [modules]);

  return (
    <div>
      <div className="border-b">
        <PageTitle
          title="System Module"
          subTitle="View system modules and update"
          showAdd
          onAddClick={() => {
            setShowUpsertModal(true);
          }}
          buttonAddConfig={{
            title: "Add Module",
          }}
          showSearch
        />
      </div>
      <div className="flex flex-col min-h-[700px] mt-20">
        <Table
          className="ibl-table"
          onRow={(record, rowIndex) => {
            return {
              onClick: (event) => {},
            };
          }}
          columns={columns}
          dataSource={sortedModules}
          onChange={onChange}
        />
      </div>
      <SystemModuleUpsert
        show={showUpsertModal}
        onClose={() => setShowUpsertModal(false)}
      />
    </div>
  );
};

export default SystemModule;

const SystemModuleUpsert: React.FC<IModal> = ({ show, onClose }) => {
  let {
    setModuleValue,
    upsertModule,
    processing,
    module,
    error,
    message: msg,
  } = useModuleStore();

  useEffect(() => {
    if (error) {
      message.error(error);
    }

    return () => {
      setModuleValue("error", "");
    };
  }, [error]);

  useEffect(() => {
    if (msg) {
      message.success(msg);
      onClose();
    }

    return () => {
      setModuleValue("message", "");
    };
  }, [msg]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    await upsertModule();
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
            title={"Add Module"}
            subTitle={"Create new system module"}
          />
        }
      >
        <form method="POST" className="md:min-h-[300px] flex flex-col">
          <div>
            <div>
              <label htmlFor="moduleName" className="block mb-2">
                Name
              </label>
              <input
                type="text"
                id="moduleName"
                name="moduleName"
                className="form-input w-full"
                placeholder="Ex. Micro Banking"
                value={module?.name || ""}
                onChange={(e) => setModuleValue("name", e.target.value)}
              />
            </div>

            {module?.id && (
              <div className="flex gap-4 items-center  mt-4">
                <label htmlFor="moduleEnabled">Enable?</label>
                <Switch
                  checkedChildren="Yes"
                  unCheckedChildren="No"
                  className="bg-gray-400"
                  id="moduleEnabled"
                />
              </div>
            )}
          </div>
          <div className="mb-3 mt-auto flex gap-4 justify-end">
            <Button
              title="Close"
              type="danger-outline"
              size="large"
              onClick={() => onClose()}
            />
            <Button
              title="Create Module"
              forForm
              type="primary"
              size="large"
              onClick={(e) => handleSubmit(e)}
              isLoading={processing}
            />
          </div>
        </form>
      </Modal>
    </>
  );
};
