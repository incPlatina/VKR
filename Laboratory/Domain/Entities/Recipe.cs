namespace Domain.Entities
{
    public class Recipe
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public int CategoryId { get; set; }
        public DateTime CreatedDate { get; set; }
        public int user_id { get; set; }
        public string proportion {  get; set; }
        public string privacy { get; set; }
        public User User { get; set; }
        public Category Category { get; set; }
        public ICollection<Ingredient> Ingredients { get; set; }
        public ICollection<Review> Reviews { get; set; }
        public ICollection<Journal> Journal { get; set; }
    }
}
