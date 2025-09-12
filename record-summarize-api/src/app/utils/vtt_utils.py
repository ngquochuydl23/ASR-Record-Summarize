from datetime import timedelta


def generate_vtt(groups, path="output.vtt", saved=False):
    lines = ["WEBVTT\n"]
    for i, (start, end, text) in enumerate(groups, 1):
        lines.append(str(i))
        lines.append(f"{sec_to_timestamp(start)} --> {sec_to_timestamp(end)}")
        lines.append(text)
        lines.append("")

    if saved:
        with open(path, "w", encoding="utf-8") as f:
            f.write("\n".join(lines))
    return lines

def sec_to_timestamp(sec: float) -> str:
    td = timedelta(seconds=sec)
    # Format hh:mm:ss.mmm
    return str(td)[:-3] if "." in str(td) else str(td) + ".000"