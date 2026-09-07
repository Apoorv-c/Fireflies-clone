def generate_summary(segments: list) -> dict:
    if not segments:
        return {
            "overview": "No transcript available to summarize.",
            "key_topics": [],
            "chapters": []
        }
        
    full_text = " ".join([s["content"] for s in segments])
    words = full_text.split()
    
    # Mock generation based on content length
    overview = "This meeting covered several important topics. "
    if len(words) > 100:
        overview += f"The team discussed various aspects over {len(segments)} segments. "
        overview += f"Key points were raised near the beginning, such as '{segments[0]['content'][:50]}...'. "
        overview += "They concluded with action items and next steps."
    else:
        overview += "It was a brief sync to touch base on current status."
        
    key_topics = [
        {"title": "Initial Updates", "description": "Status updates from the team regarding ongoing tasks."},
        {"title": "Blockers", "description": "Discussion of current blockers and potential solutions."},
        {"title": "Planning", "description": "Outlining the next steps and assigning action items."}
    ]
    
    chapters = [
        {"title": "Introduction", "start_time": segments[0]["start_time"] if segments else 0, "end_time": segments[min(len(segments)//3, len(segments)-1)]["end_time"] if segments else 0},
        {"title": "Deep Dive", "start_time": segments[min(len(segments)//3, len(segments)-1)]["start_time"] if segments else 0, "end_time": segments[min(len(segments)*2//3, len(segments)-1)]["end_time"] if segments else 0},
        {"title": "Wrap Up", "start_time": segments[min(len(segments)*2//3, len(segments)-1)]["start_time"] if segments else 0, "end_time": segments[-1]["end_time"] if segments else 0}
    ]
    
    return {
        "overview": overview,
        "key_topics": key_topics,
        "chapters": chapters
    }
