import { Switch } from "antd";
import React from "react";
import Button from "@/components/common/Button";
import PageTitle from "@/components/common/PageTitle";

const MakerChecker: React.FC = () => {
  return (
    <div>
      <PageTitle
        title="Maker Checker"
        subTitle="Configure which module requires the marker checker"
        showAdd={false}
        showSearch={false}
      />

      <div className="w-full md:w-1/2">
        <form className="">
          <div className="mb-6 flex items-center gap-x-6">
            <label htmlFor="startNode">GL Posting</label>
            <Switch
              checkedChildren="Off"
              unCheckedChildren="On"
              className="bg-gray-400"
            />
          </div>
          <div className="mb-12 flex items-center gap-x-6">
            <label htmlFor="startNode">Direct Posting</label>
            <Switch
              checkedChildren="Off"
              unCheckedChildren="On"
              className="bg-gray-400"
            />
          </div>

          <div className="py-12 flex gap-x-3">
            <Button title="Save Settings" type="primary" size="large" />
            <Button title="Reset" type="danger-outline" size="large" />
          </div>
        </form>
      </div>
    </div>
  );
};

export default MakerChecker;
