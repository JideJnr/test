const Stepper: React.FC<{
  steps: any[];
  selectedStep: number;
  setSelectedStep: (number) => void;
  processing: boolean;
}> = ({ steps, selectedStep, setSelectedStep, processing }) => {
  return (
    <ol className="items-center w-full space-y-4 sm:flex sm:space-x-8 sm:space-y-0 my-12">
      {steps.map((step) => (
        <li
          key={step.id}
          className={`${
            selectedStep === step.id
              ? "text-blue-600 pointer-events-none"
              : selectedStep > step.id
              ? "font-medium text-blue-700 cursor-pointer"
              : "text-gray-500 cursor-not-allowed"
          } flex items-center space-x-2.5`}
          onClick={(e) => {
            e.preventDefault();

            if (selectedStep > step.id && !processing) {
              setSelectedStep(step.id);
            }
          }}
        >
          <span
            className={`flex items-center justify-center w-8 h-8 border rounded-full shrink-0 ${
              selectedStep === step.id
                ? "border-blue-600"
                : selectedStep > step.id
                ? "bg-blue-600 text-white border-blue-600"
                : "border-gray-500"
            }`}
          >
            {step.number}
          </span>
          <span>
            <h3 className="leading-tight">{step.label}</h3>
          </span>
        </li>
      ))}
    </ol>
  );
};

export default Stepper;
