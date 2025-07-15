import '../src/Blog.css';
import blogPosts from './models/blogPosts';

export default function Blog() {
  return (
    <div className="blog-page-container">
      <div className="blog-header">
        <h1 className="blog-heading">Our Blog</h1>
        <p className="blog-intro">
          Stay tuned for our latest articles, tips, and updates on web development, design, and technology trends!
        </p>
      </div>
      <div className="blog-posts-grid">
        {blogPosts.map(post => (
          <div key={post.id} className="blog-post-card">
            <h2 className="post-card-title">{post.title}</h2>
            <p className="post-card-excerpt">{post.excerpt}</p>
            <div className="post-card-meta">
              <span className="post-card-author">{post.author}</span>
              <span className="post-card-date">{post.date}</span>
            </div>
            <a href="#" className="post-card-read-more">Read More →</a>
          </div>
        ))}
      </div>
    </div>
  );
}