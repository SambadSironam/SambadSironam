import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "../../firebase";
import { ChevronLeft, ChevronRight, ExternalLink, Download } from "lucide-react";

interface EPaperItem {
  id: string;
  title: string;
  date: string;
  pdfUrl: string;
}

export default function EPaper() {
  const [papers, setPapers] = useState<EPaperItem[]>([]);
  const [selectedPaper, setSelectedPaper] =
    useState<EPaperItem | null>(null);

  const [currentPage, setCurrentPage] = useState(1);

  const papersPerPage = 3;

  useEffect(() => {
    if (selectedPaper) {
      setCurrentPage(1);
    }
  }, [selectedPaper]);

  useEffect(() => {
    const loadPapers = async () => {
      try {
        const q = query(
          collection(db, "epapers"),
          orderBy("createdAt", "desc")
        );

        const snapshot = await getDocs(q);

        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<EPaperItem, "id">),
        }));

        setPapers(data);

        if (data.length > 0) {
          setSelectedPaper(data[0]);
        }
      } catch (err) {
        console.error(err);
      }
    };

    loadPapers();
  }, []);

  const indexOfLastPaper = currentPage * papersPerPage;

  const indexOfFirstPaper =
    indexOfLastPaper - papersPerPage;

  const currentPapers = papers.slice(
    indexOfFirstPaper,
    indexOfLastPaper
  );

  const totalPages = Math.ceil(
    papers.length / papersPerPage
  );

  const visiblePageNumbers = () => {
    if (totalPages <= 3) {
      return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    if (currentPage <= 2) {
      return [1, 2, totalPages];
    }

    if (currentPage >= totalPages - 1) {
      return [1, totalPages - 1, totalPages];
    }

    return [1, currentPage, totalPages];
  };

  const handleSelectPaper = (paper: EPaperItem) => {
    setSelectedPaper(paper);
    setCurrentPage(1);
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => prev + 1);
  };

  const pdfViewerSrc = selectedPaper
    ? `${selectedPaper.pdfUrl}#page=${currentPage}&view=FitH`
    : "";

  return (
    <div className="min-h-screen bg-[#F7F8FA] dark:bg-[#121212]">

      {/* Hero */}

      <section className="bg-gradient-to-r from-red-700 to-red-900 text-white py-10">

        <div className="max-w-7xl mx-auto px-4">

          <h1
            className="text-4xl font-bold"
            style={{
              fontFamily:
                "'Noto Serif Bengali', serif",
            }}
          >
            ই-পেপার
          </h1>

          <p
            className="mt-4 text-red-100"
            style={{
              fontFamily:
                "'Noto Sans Bengali', sans-serif",
            }}
          >
            সংবাদ শিরোনামের ডিজিটাল সংবাদপত্র
          </p>

        </div>

      </section>

      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* PDF */}

        <div className="bg-[#f7ecd2] dark:bg-gray-800 rounded-[32px] p-3 md:p-5 shadow-[0_20px_60px_rgba(0,0,0,0.15)] border border-[#e8dcc0]">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {selectedPaper?.title || "ই-পেপার"}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {selectedPaper?.date || "একটি পিডিএফ পৃষ্ঠা দেখুন"}
              </p>
            </div>

            {selectedPaper && (
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  className="flex items-center gap-1 rounded-full border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <ChevronLeft size={16} />
                  পূর্বের পৃষ্ঠা
                </button>
                <span className="rounded-full bg-red-600 px-3 py-2 text-sm font-semibold text-white">
                  পৃষ্ঠা {currentPage}
                </span>
                <button
                  onClick={handleNextPage}
                  className="flex items-center gap-1 rounded-full border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-100"
                >
                  পরের পৃষ্ঠা
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </div>

          <div className="rounded-[24px] overflow-hidden border border-[#d8c8a6] bg-white shadow-inner">
            {selectedPaper ? (
              <iframe
                key={`${selectedPaper.id}-${currentPage}`}
                src={pdfViewerSrc}
                title={selectedPaper.title}
                className="w-full h-[75vh] min-h-[500px]"
              />
            ) : (
              <div className="h-[75vh] min-h-[500px] flex items-center justify-center text-gray-500">
                কোনো ই-পেপার উপলব্ধ নেই
              </div>
            )}
          </div>
        </div>

        {selectedPaper && (
          <div className="mt-6 flex flex-nowrap items-center gap-2 overflow-x-auto pb-1">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="flex shrink-0 items-center gap-2 rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 sm:px-4 sm:py-3"
            >
              <ChevronLeft size={16} />
              <span className="whitespace-nowrap">আগের পৃষ্ঠা</span>
            </button>

            <button
              onClick={handleNextPage}
              className="flex shrink-0 items-center gap-2 rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-100 sm:px-4 sm:py-3"
            >
              <span className="whitespace-nowrap">পরের পৃষ্ঠা</span>
              <ChevronRight size={16} />
            </button>

            <a
              href={selectedPaper.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex shrink-0 items-center gap-2 rounded-xl bg-red-600 px-3 py-2.5 text-sm font-medium text-white transition hover:bg-red-700 sm:px-4 sm:py-3"
            >
              <ExternalLink size={16} />
              <span className="whitespace-nowrap">পূর্ণ স্ক্রিনে খুলুন</span>
            </a>

            <a
              href={selectedPaper.pdfUrl}
              download
              className="flex shrink-0 items-center gap-2 rounded-xl border border-gray-300 px-3 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800 sm:px-4 sm:py-3"
            >
              <Download size={16} />
              <span className="whitespace-nowrap">PDF ডাউনলোড</span>
            </a>
          </div>
        )}

        {/* Previous Editions */}

        <div className="mt-10">

          <h2 className="text-2xl font-bold mb-6">
            Previous Editions
          </h2>

          <div className="grid md:grid-cols-3 gap-5">
                        {currentPapers.map((paper) => (

              <button
                key={paper.id}
                onClick={() => handleSelectPaper(paper)}
                className={`rounded-2xl border p-5 text-left transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
                  selectedPaper?.id === paper.id
                    ? "border-red-600 bg-red-50 dark:bg-red-900/20"
                    : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
                }`}
              >

                <div className="text-lg font-bold text-gray-900 dark:text-white">
                  {paper.title}
                </div>

                <div className="text-sm text-gray-500 mt-2">
                  {paper.date}
                </div>

              </button>

            ))}

          </div>

          {/* Pagination */}

          {papers.length > papersPerPage && (
            <div className="flex flex-wrap justify-center items-center gap-2 mt-10">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-lg bg-red-600 text-white disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                ◀ পূর্ববর্তী
              </button>

              <div className="flex items-center gap-2">
                {visiblePageNumbers().map((pageNumber) => (
                  <button
                    key={pageNumber}
                    onClick={() => setCurrentPage(pageNumber)}
                    className={`w-10 h-10 rounded-full font-bold transition ${
                      currentPage === pageNumber
                        ? "bg-red-600 text-white"
                        : "bg-gray-200 dark:bg-gray-700"
                    }`}
                  >
                    {pageNumber}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-lg bg-red-600 text-white disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                পরবর্তী ▶
              </button>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}