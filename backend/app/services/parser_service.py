import re
import json

def parse_vtt(content: str) -> list[dict]:
    segments = []
    # Simplified VTT parsing
    blocks = content.strip().split('\n\n')
    for block in blocks:
        lines = block.split('\n')
        if len(lines) >= 2 and '-->' in lines[0]:
            time_line = lines[0]
            text_line = " ".join(lines[1:])
            
            # extract times
            times = time_line.split('-->')
            if len(times) == 2:
                start_str = times[0].strip()
                end_str = times[1].strip()
                
                # convert to seconds
                def to_seconds(t):
                    parts = t.split(':')
                    if len(parts) == 3:
                        h, m, s = parts
                        return int(h)*3600 + int(m)*60 + float(s)
                    elif len(parts) == 2:
                        m, s = parts
                        return int(m)*60 + float(s)
                    return 0.0
                
                start = to_seconds(start_str)
                end = to_seconds(end_str)
                
                speaker = "Unknown"
                if text_line.startswith('<v '):
                    match = re.search(r'<v ([^>]+)>(.*)', text_line)
                    if match:
                        speaker = match.group(1)
                        text_line = match.group(2)
                        
                segments.append({
                    "speaker": speaker,
                    "start_time": start,
                    "end_time": end,
                    "content": text_line
                })
    return segments

def parse_txt(content: str) -> list[dict]:
    segments = []
    lines = content.strip().split('\n')
    current_time = 0.0
    for line in lines:
        if line.strip():
            segments.append({
                "speaker": "Speaker 1",
                "start_time": current_time,
                "end_time": current_time + 5.0,
                "content": line.strip()
            })
            current_time += 5.0
    return segments

def parse_json(content: str) -> list[dict]:
    try:
        data = json.loads(content)
        segments = []
        for item in data:
            segments.append({
                "speaker": item.get("speaker", "Unknown"),
                "start_time": float(item.get("start", 0)),
                "end_time": float(item.get("end", 0)),
                "content": item.get("text", "")
            })
        return segments
    except json.JSONDecodeError:
        return []

def parse_transcript(filename: str, content: str) -> list[dict]:
    if filename.endswith('.vtt'):
        return parse_vtt(content)
    elif filename.endswith('.json'):
        return parse_json(content)
    else:
        return parse_txt(content)
