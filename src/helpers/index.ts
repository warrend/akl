export function formatDate(isoString: string | Date) {
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const date = new Date(isoString);
  const day = date.getDate();
  const monthIndex = date.getMonth();
  const year = date.getFullYear();

  const suffixes = ['th', 'st', 'nd', 'rd'];
  const relevantDigits = day < 30 ? day % 20 : day % 30;
  const suffix = relevantDigits <= 3 ? suffixes[relevantDigits] : suffixes[0];

  return `${months[monthIndex]} ${day}${suffix}, ${year}`;
}

export function groupByYear(posts: any[]) {
  const grouped = posts.reduce((acc, post) => {
    const date = new Date(post.frontmatter.date);

    if (isNaN(date.getTime())) {
      return acc;
    }

    const year = date.getFullYear();

    if (!acc[year]) {
      acc[year] = [];
    }

    acc[year].push(post);
    return acc;
  }, {});

  for (const year in grouped) {
    grouped[year].sort((a: any, b: any) => {
      const dateA = new Date(a.frontmatter.date);
      const dateB = new Date(b.frontmatter.date);
      return dateB.getTime() - dateA.getTime(); // For descending order
    });
  }

  return grouped;
}
