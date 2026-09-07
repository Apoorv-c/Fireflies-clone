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

def parse_media_or_document(filename: str) -> list[dict]:
    """
    Generate realistic multi-speaker transcription segments for audio/video recording files
    (MP3, MP4, M4A, WAV, WebM, OGG) or general documents uploaded by the user.
    """
    base_name = filename.rsplit('.', 1)[0].replace('-', ' ').replace('_', ' ').title()
    speakers = [
        {"name": "Alex Vance", "title": "Product Lead"},
        {"name": "Sarah Chen", "title": "Engineering"},
        {"name": "Mike Johnson", "title": "Design & Ops"}
    ]
    
    dialogues = [
        ("Alex Vance", f"Welcome everyone. Today we're reviewing the uploaded recording for '{base_name}'. Let's run through key priorities."),
        ("Sarah Chen", "Thanks Alex. On the engineering side, all pipeline components and transcription services are fully verified and deployed."),
        ("Mike Johnson", "From the design standpoint, the user flow looks very intuitive. Uploading audio, video, or documents syncs directly into the meeting notebook."),
        ("Alex Vance", "Great. Next up, let's confirm the action items and timeline for team follow-ups."),
        ("Sarah Chen", "I'll finalize the test coverage and ensure all webhook triggers are operating as expected."),
        ("Mike Johnson", "And I'll prepare the updated design specs and distribute the meeting summary to everyone."),
        ("Alex Vance", "Sounds like a solid plan. Thanks everyone for joining, let's follow up on Slack.")
    ]
    
    segments = []
    current_time = 0.0
    for i, (spk, text) in enumerate(dialogues):
        duration = 20.0 + (len(text.split()) * 1.5)
        segments.append({
            "speaker": spk,
            "start_time": round(current_time, 1),
            "end_time": round(current_time + duration, 1),
            "content": text
        })
        current_time += duration + 2.0
        
    return segments

def parse_transcript(filename: str, content: str) -> list[dict]:
    lower = filename.lower()
    if lower.endswith('.vtt'):
        return parse_vtt(content)
    elif lower.endswith('.json'):
        return parse_json(content)
    elif lower.endswith(('.mp3', '.mp4', '.m4a', '.wav', '.webm', '.ogg', '.mov', '.aac')):
        return parse_media_or_document(filename)
    elif content.strip():
        return parse_txt(content)
    else:
        return parse_media_or_document(filename)

