import json
import os

def generate_sql():
    with open('arabic_articles.json', 'r', encoding='utf-8') as f:
        ar_articles = json.load(f)
    
    with open('english_articles.json', 'r', encoding='utf-8') as f:
        en_articles = json.load(f)
    
    sql_lines = []
    sql_lines.append("-- Migration to add 100 articles (50 Arabic, 50 English)")
    sql_lines.append("INSERT INTO blog_posts (title, slug, content, excerpt, authorId, category, tags, featured, published) VALUES")
    
    # Assuming authorId 1 is the admin
    author_id = 1
    
    values = []
    
    # Process Arabic articles
    for art in ar_articles:
        title = art['title_ar'].replace("'", "''")
        slug = art['slug_ar']
        content = art['content_ar'].replace("'", "''")
        excerpt = content[:150].replace("'", "''") + "..."
        category = art['category_ar'].replace("'", "''")
        tags = ",".join(art['tags_ar']).replace("'", "''")
        
        values.append(f"('{title}', '{slug}', '{content}', '{excerpt}', {author_id}, '{category}', '{tags}', 0, 1)")
        
    # Process English articles
    for art in en_articles:
        title = art['title_en'].replace("'", "''")
        slug = art['slug_en'] + "-en" # Ensure unique slug if same as Arabic
        content = art['content_en'].replace("'", "''")
        excerpt = content[:150].replace("'", "''") + "..."
        category = art['category_en'].replace("'", "''")
        tags = ",".join(art['tags_en']).replace("'", "''")
        
        values.append(f"('{title}', '{slug}', '{content}', '{excerpt}', {author_id}, '{category}', '{tags}', 0, 1)")
        
    sql_lines.append(",\n".join(values) + ";")
    
    with open('drizzle/migrations/add_100_articles.sql', 'w', encoding='utf-8') as f:
        f.write("\n".join(sql_lines))

if __name__ == "__main__":
    generate_sql()
