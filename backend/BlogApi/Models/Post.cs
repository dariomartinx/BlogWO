using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BlogApi.Models
{
    public class Post
    {
        // Primary Key
        public int PostId { get; set; }

        // Campos normales
        public string? Title { get; set; }
        public string? Content { get; set; }
        public DateTime PublishedAt { get; set; } = DateTime.Now;

        // Foreign Key (FK)
        public int BlogId { get; set; }

        // Navegación hacia Blog
        public Blog? Blog { get; set; }
    }
}
