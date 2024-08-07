import Button from "@/components/common/Button";

interface iPaginate {
  onNext: () => void;
  onPrevious: () => void;
  canNext: boolean;
  canBack: boolean;
  currentPage: number;
  totalPages: number;
  className?: string;
}

const Pagination: React.FC<iPaginate> = ({
  onNext,
  onPrevious,
  canNext,
  canBack,
  currentPage,
  totalPages,
  className,
}) => {
  return (
    <>
      <div
        className={`flex justify-between items-center ${
          className || "mt-auto"
        }`}
      >
        <p>
          Showing {currentPage} of {totalPages}
        </p>
        <div className="flex gap-3 items-center">
          <Button
            title="Previous"
            onClick={() => onPrevious()}
            disabled={!canBack}
            size="medium"
            type="primary"
          />
          <Button
            title="Next"
            onClick={() => onNext()}
            disabled={!canNext}
            size="medium"
            type="primary"
          />
        </div>
      </div>
    </>
  );
};

export default Pagination;
