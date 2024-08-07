import React from "react";

export const TimelineDetail: React.FC<{
  name: string;
  comment: React.ReactNode;
  status: React.ReactNode;
}> = ({ name, comment, status }) => {
  return (
    <div>
      <span className="text-xs">{status}</span>
      <h6 className="text-sm text-blue-700 font-semibold">{name}</h6>
      <p className="text-sm my-2">{comment}</p>
    </div>
  );
};
