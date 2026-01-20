/**
 * Factory Search & Filtering Unit Tests
 */

describe("Factory Search & Filtering", () => {
  const mockFactories = [
    {
      id: 1,
      name: "Factory A",
      location: "Shanghai",
      verificationStatus: "verified",
      category: "Electronics",
      rating: 4.5,
    },
    {
      id: 2,
      name: "Factory B",
      location: "Beijing",
      verificationStatus: "pending",
      category: "Textiles",
      rating: 3.8,
    },
    {
      id: 3,
      name: "Factory C",
      location: "Shenzhen",
      verificationStatus: "verified",
      category: "Electronics",
      rating: 4.2,
    },
  ];

  describe("Search", () => {
    it("should find factories by name", () => {
      const query = "Factory A";
      const results = mockFactories.filter((f) =>
        f.name.toLowerCase().includes(query.toLowerCase())
      );

      expect(results).toHaveLength(1);
      expect(results[0].name).toBe("Factory A");
    });

    it("should find factories by location", () => {
      const query = "Shanghai";
      const results = mockFactories.filter((f) =>
        f.location.toLowerCase().includes(query.toLowerCase())
      );

      expect(results).toHaveLength(1);
      expect(results[0].location).toBe("Shanghai");
    });

    it("should return empty array for non-existent factory", () => {
      const query = "Non-existent";
      const results = mockFactories.filter((f) =>
        f.name.toLowerCase().includes(query.toLowerCase())
      );

      expect(results).toHaveLength(0);
    });
  });

  describe("Filtering", () => {
    it("should filter by verification status", () => {
      const status = "verified";
      const results = mockFactories.filter(
        (f) => f.verificationStatus === status
      );

      expect(results).toHaveLength(2);
      expect(results.every((f) => f.verificationStatus === "verified")).toBe(
        true
      );
    });

    it("should filter by category", () => {
      const category = "Electronics";
      const results = mockFactories.filter((f) => f.category === category);

      expect(results).toHaveLength(2);
      expect(results.every((f) => f.category === "Electronics")).toBe(true);
    });

    it("should filter by rating", () => {
      const minRating = 4.0;
      const results = mockFactories.filter((f) => f.rating >= minRating);

      expect(results).toHaveLength(2);
      expect(results.every((f) => f.rating >= minRating)).toBe(true);
    });

    it("should apply multiple filters", () => {
      const status = "verified";
      const category = "Electronics";
      const results = mockFactories.filter(
        (f) => f.verificationStatus === status && f.category === category
      );

      expect(results).toHaveLength(2);
      expect(results.every((f) => f.verificationStatus === "verified")).toBe(
        true
      );
      expect(results.every((f) => f.category === "Electronics")).toBe(true);
    });
  });

  describe("Sorting", () => {
    it("should sort by rating ascending", () => {
      const sorted = [...mockFactories].sort((a, b) => a.rating - b.rating);

      expect(sorted[0].rating).toBe(3.8);
      expect(sorted[sorted.length - 1].rating).toBe(4.5);
    });

    it("should sort by rating descending", () => {
      const sorted = [...mockFactories].sort((a, b) => b.rating - a.rating);

      expect(sorted[0].rating).toBe(4.5);
      expect(sorted[sorted.length - 1].rating).toBe(3.8);
    });

    it("should sort by name alphabetically", () => {
      const sorted = [...mockFactories].sort((a, b) =>
        a.name.localeCompare(b.name)
      );

      expect(sorted[0].name).toBe("Factory A");
      expect(sorted[sorted.length - 1].name).toBe("Factory C");
    });
  });

  describe("Pagination", () => {
    it("should paginate results correctly", () => {
      const pageSize = 2;
      const page = 1;
      const start = (page - 1) * pageSize;
      const results = mockFactories.slice(start, start + pageSize);

      expect(results).toHaveLength(2);
      expect(results[0].id).toBe(1);
      expect(results[1].id).toBe(2);
    });

    it("should handle last page with fewer items", () => {
      const pageSize = 2;
      const page = 2;
      const start = (page - 1) * pageSize;
      const results = mockFactories.slice(start, start + pageSize);

      expect(results).toHaveLength(1);
      expect(results[0].id).toBe(3);
    });
  });
});
