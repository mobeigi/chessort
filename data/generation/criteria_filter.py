"""
Lichess Criteria Filter

Used to find how many items match our query.
Useful for determining criteria that result in chunks with a decent number of games in them.
"""

import csv
from collections import defaultdict

def process_csv(file_path, offset, num_lines, popularity_threshold, nbplays_threshold, rating_deviation_threshold, min_rating, max_rating, theme_filter):
    count = 0
    theme_counts = defaultdict(int)
    matching_items = []
    
    with open(file_path, mode='r', newline='') as file:
        reader = csv.DictReader(file)
        for i, row in enumerate(reader):
            if i < offset:
                continue
            if i >= offset + num_lines:
                break
            
            if (int(row['Popularity']) > popularity_threshold and
                int(row['NbPlays']) > nbplays_threshold and
                int(row['RatingDeviation']) < rating_deviation_threshold and
                min_rating <= int(row['Rating']) <= max_rating):
                
                themes = row['Themes'].split()
                if theme_filter and not any(theme in themes for theme in theme_filter):
                    continue

                count += 1
                matching_items.append(row)
                
                for theme in themes:
                    theme_counts[theme] += 1

    return count, theme_counts, matching_items

def print_matching_items(matching_items):
    for item in matching_items:
        print(f"PuzzleId: {item['PuzzleId']}, FEN: {item['FEN']}")
        print(f"Rating: {item['Rating']}, NbPlays: {item['NbPlays']}, Popularity: {item['Popularity']}, RatingDeviation: {item['RatingDeviation']}")
        print(f"Themes: {item['Themes']}")
        print(f"GameUrl: {item['GameUrl']}")
        print("-" * 40)

# Parameters
file_path = './lichess-data/lichess_db_puzzle.csv'
offset = 1700000  # Start at a specific offset in the file
num_lines = 1000  # Process a specific number of lines

popularity_threshold = 90  # Count rows with Popularity higher than this value
nbplays_threshold = 100  # Count rows with NbPlays higher than this value
rating_deviation_threshold = 100  # Count rows with RatingDeviation lower than this value
min_rating = 0  # Minimum rating
max_rating = 9999  # Maximum rating
theme_filter = []  # List of themes to filter for

result, theme_counts, matching_items = process_csv(file_path, offset, num_lines, popularity_threshold, nbplays_threshold, rating_deviation_threshold, min_rating, max_rating, theme_filter)

# Print results
print("Matching Items:")
print_matching_items(matching_items)

print("Theme counts:")
for theme, count in theme_counts.items():
    print(f"{theme}: {count}")

print(f"Number of matching items: {result}")
