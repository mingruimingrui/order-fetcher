import os
import json
import zipfile
import datetime
from collections import OrderedDict

def zipdir(path, ziproot, ziph):
    for root, dirs, files in os.walk(path):
        for file in files:
            ziph.write(os.path.join(root, file), os.path.join(root[(len(path) + 1):], file))

def writejson(data, file):
    with open(file) as json_file:
        json.dump(data, json_file, indent=4)

# paths
zip_progress_file = 'logs/zip-progress.json'
data_path = 'data'
zip_path = 'data-zip'

# cur date
cur_date = datetime.datetime.utcnow()
formatted_date = str(cur_date)[:10]

# unzipped date files
dates = [d for d in os.listdir(data_path) if d != formatted_date]
dates = [d for d in dates if d[0] != '.']
dates = list(sorted(dates))

# zipped date files
done_dates = [os.path.splitext(d)[0] for d in os.listdir(zip_path) if d!= formatted_date]
done_dates = [d for d in done_dates if d[0] != '.']
done_dates = list(sorted(done_dates))

all_dates = list(sorted(set(dates + done_dates)))
all_dates_dict = {d: False for d in all_dates}

# if os.path.isfile(zip_progress_file):
#     with open(zip_progress_file, 'w') as json_file:
#
# else:
#     with open(zip_progress_file) as json_file:
#         previously_done_dates =


# for date in dates:
#     zip_filename = 'data-zip/' + date + '.zip'
#     if not os.path.isfile(zip_filename):
#         zipf = zipfile.ZipFile(zip_filename, 'w', zipfile.ZIP_DEFLATED)
#         zipdir(os.path.join(data_path, date), '.', zipf)
#         zipf.close()
#         print('Successfully zipped', os.path.join(data_path, date))

all_dates_dict = OrderedDict(sorted(all_dates_dict.items()))

writejson(all_dates_dict, zip_progress_file)

print(all_dates)
print()
print(all_dates_dict)
