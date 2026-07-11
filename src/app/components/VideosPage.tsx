export default function VideosPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6 text-center">
        ভিডিও সংবাদ
      </h1>

      <p className="text-center text-gray-600 mb-8">
        আমাদের সর্বশেষ YouTube ভিডিওগুলি দেখুন
      </p>

      <div className="rounded-xl overflow-hidden shadow-lg">
        <iframe
          width="100%"
          height="900"
          src="https://www.youtube.com/embed?listType=user_uploads&list=UCiV2_4B4Ut6-RqmtH27oUgQ"
          title="Sambad Sironam YouTube Videos"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    </div>
  );
}