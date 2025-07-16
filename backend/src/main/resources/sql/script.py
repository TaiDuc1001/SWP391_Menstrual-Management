import random
from datetime import datetime, timedelta
from glob import glob

FILENAME = '02_schedules.sql'
DOCTOR_IDS = [1, 6, 7, 8, 9, 10]
SLOTS = list(range(1, 9))
START_DATE = '2025-05-01'
END_DATE = '2025-08-31'

def get_all_dates(start_date: str, end_date: str):
    start = datetime.strptime(start_date, "%Y-%m-%d")
    end = datetime.strptime(end_date, "%Y-%m-%d")
    delta = timedelta(days=1)
    dates = []
    current = start
    while current <= end:
        dates.append(current.strftime("%Y-%m-%d"))
        current += delta
    return dates

def generate_schedule_inserts(dates, doctor_ids, slots):
    statements = []
    for day in dates:
        for doctor_id in doctor_ids:
            times = random.randint(4, 8)
            selected_slots = random.sample(slots, times)
            for slot in selected_slots:
                statements.append(f"INSERT INTO schedules (date, slot, doctor_id) VALUES ('{day}', '{slot}', {doctor_id});\n")
    return statements


def generate_schedule():
    with open(FILENAME, 'r') as f:
        content = f.readlines()
    all_dates = get_all_dates(START_DATE, END_DATE)
    inserts = generate_schedule_inserts(all_dates, DOCTOR_IDS, SLOTS)
    content.extend(inserts)
    with open(FILENAME, 'w') as f:
        f.writelines(content)

def remove_comments():
    sql_files = glob('*.sql')
    for file in sql_files:
        with open(file, 'r') as f:
            content = f.readlines()
        content = [line for line in content if not line.strip().startswith('--')]
        with open(file, 'w') as f:
            f.writelines(content)

def main():
    generate_schedule()

if __name__ == "__main__":
    main()