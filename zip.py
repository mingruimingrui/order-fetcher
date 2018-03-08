import os
import zipfile
import datetime

def zipdir(path, ziproot, ziph):
    for root, dirs, files in os.walk(path):
        for file in files:
            ziph.write(os.path.join(root, file), os.path.join(root[(len(path) + 1):], file))

cur_date = datetime.datetime.utcnow()
formatted_date = str(cur_date)[:10]
data_path = 'data'
dates = [d for d in os.listdir(data_path) if d != formatted_date]
dates = [d for d in dates if d[0] != '.']

for date in []:
    zip_filename = 'data-zip/' + date + '.zip'
    if not os.path.isfile(zip_filename):
        zipf = zipfile.ZipFile(zip_filename, 'w', zipfile.ZIP_DEFLATED)
        zipdir(os.path.join(data_path, date), '.', zipf)
        zipf.close()
        print('Successfully zipped', os.path.join(data_path, date))
