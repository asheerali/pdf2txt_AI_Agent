# methods/log_store.py
log_stream = []

def log_message(msg):
    print(msg)  # optional
    log_stream.append(msg)


