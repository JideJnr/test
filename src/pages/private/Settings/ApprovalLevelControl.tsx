import React from "react";
import Button from "@/components/common/Button";
import PageTitle from "@/components/common/PageTitle";

const ApprovalLevelControl: React.FC = () => {
  return (
    <div>
      <PageTitle
        title="Approval Levels"
        subTitle="Configure workflow approval levels"
        showAdd={false}
        showSearch={false}
      />

      <div className="w-full md:w-1/2">
        <form className="flex flex-col gap-y-4">
          <div className="mb-6">
            <label htmlFor="startNode">Start Node</label>
            <select
              name="startNode"
              id="startNode"
              className="form-select block w-full"
            >
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">6</option>
            </select>
          </div>
          <div className="mb-6">
            <label htmlFor="endNode">End Node</label>
            <select
              name="endNode"
              id="endNode"
              className="form-select block w-full"
            >
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">6</option>
            </select>
          </div>

          <div className="my-6 flex gap-x-3">
            <Button title="Save Settings" type="primary" size="large" />
            <Button title="Reset" type="danger-outline" size="large" />
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApprovalLevelControl;
