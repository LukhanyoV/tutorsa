# Calculating the ratings

* weigh each rating with the number of votes it got
```sql
SELECT rating_given as weight, COUNT(rating_given) as count FROM ratings GROUP BY rating_given;
```
```js
const ratings = [
    {
        weight: 5,
        count: 346
    },
    {
        weight: 4,
        count: 36
    },
    {
        weight: 3,
        count: 46
    },
    {
        weight: 2,
        count: 34
    },
    {
        weight: 1,
        count: 3
    }
]
```
```js
const calcAverageRating = (ratings) => {

  let totalWeight = 0
  let totalReviews = 0

  ratings.forEach((rating) => {
    totalWeight += rating.weight * rating.count
    totalReviews += rating.count
  })

  const averageRating = totalWeight / totalReviews

  return averageRating.toFixed(2)
}
```