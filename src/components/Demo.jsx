import React, { useState, useEffect } from 'react';
import { linkIcon, tick, copy, loader } from '../assets';
import './Demo.css';
import { useLazyGetSummaryQuery } from '../Services/article';

const Demo = () => {
  const [article, setArticle] = useState({
    url: '',
    summary: '',
  });

  const [allArticles, setAllArticles] = useState([]);
  const [copied, setCopied] = useState("");

  // Load articles from localStorage on component mount
  useEffect(() => {
    const articlesFromLocalStorage = JSON.parse(localStorage.getItem("articles"));
    if (articlesFromLocalStorage) {
      setAllArticles(articlesFromLocalStorage);
    }
  }, []);

  const [getSummary, { data, error, isFetching }] = useLazyGetSummaryQuery();

  // Submit function to fetch the summary of the article
  const handleSubmit = async (e) => {
    e.preventDefault();
    const existingArticle = allArticles.find((item) => item.url === article.url);

    if (existingArticle) return setArticle(existingArticle);

    const response = await getSummary({ articleUrl: article.url });
    if (response.data?.summary) {
      const newArticle = { ...article, summary: response.data.summary };
      const updatedAllArticles = [newArticle, ...allArticles];

      setArticle(newArticle);
      setAllArticles(updatedAllArticles);
      localStorage.setItem("articles", JSON.stringify(updatedAllArticles));
    }
  };

  // Copy URL to clipboard
  const handleCopy = (copyUrl) => {
    setCopied(copyUrl);
    navigator.clipboard.writeText(copyUrl);
    setTimeout(() => setCopied(""), 3000);
  };

  // Handle Enter key press for form submission
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSubmit(e);
    }
  };

  // Function to delete the entire browsing history
  const handleDeleteHistory = () => {
    setAllArticles([]); // Clear the state
    localStorage.removeItem("articles"); // Remove the articles from localStorage
  };

  return (
    <section className="demo-container">
      <div className="form-container">
        <form className="form" onSubmit={handleSubmit}>
          <img src={linkIcon} alt="link_icon" className="link-icon" />
          <input
            type="url"
            placeholder="Paste the link..."
            value={article.url}
            onChange={(e) => setArticle({ ...article, url: e.target.value })}
            onKeyDown={handleKeyDown}
            required
            className="url-input"
          />
          <button type="submit" className="submit-btn">Go</button>
        </form>
        
        {/* Delete History Button */}
        <button onClick={handleDeleteHistory} className="delete-btn mt-4">
          Delete History
        </button>
      </div>

      {/* Browse History */}
      <div className="flex flex-col gap-2 max-h-60 overflow-y-auto my-6">
        {allArticles.reverse().map((item, index) => (
          <div
            key={`link-${index}`}
            onClick={() => setArticle(item)}
            className="link_card p-2"
          >
            <div className="copy_btn" onClick={() => handleCopy(item.url)}>
              <img
                src={copied === item.url ? tick : copy}
                alt={copied === item.url ? "tick_icon" : "copy_icon"}
                className="w-6 h-6 object-contain"
              />
            </div>
            <p className="flex-1 font-satoshi text-blue-700 font-medium text-sm truncate">
              {item.url}
            </p>
          </div>
        ))}
      </div>

      {/* Display Result */}
      <div className="my-12 max-w-full flex flex-col items-center gap-8">
        {isFetching ? (
          <img src={loader} alt="loader" className="w-20 h-20 object-contain" />
        ) : error ? (
          <p className="font-inter font-bold text-black text-center">
            Well, that wasn’t supposed to happen...
            <br />
            <span className="font-satoshi font-normal text-gray-700">
              {error?.data?.error || "Please try again."}
            </span>
          </p>
        ) : (
          article.summary && (
            <div className="flex flex-col gap-4 items-center">
              <h2 className="font-satoshi font-bold text-gray-600 text-xl mb-2">
                 <span className="blue_gradient">Summary</span>
              </h2>
              <div className="summary_box p-4 rounded-lg shadow-lg">
                <p className="font-inter font-medium text-sm text-gray-700">
                  {article.summary}
                </p>
              </div>
            </div>
          )
        )}
      </div>
    </section>
  );
};

export default Demo;
