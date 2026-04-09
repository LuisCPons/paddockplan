import re

def parse_svg_path(path):
    commands = re.findall(r'([MLHVCSQTAzmlhvcsqtaz])([^MLHVCSQTAzmlhvcsqtaz]*)', path)
    current_pos = [0, 0]
    segments = []
    
    for cmd, args in commands:
        args = [float(x) for x in re.findall(r'[-+]?\d*\.\d+|\d+', args)]
        
        # Handle MoveTo
        if cmd == 'M':
            current_pos = [args[0], args[1]]
        elif cmd == 'm':
            current_pos[0] += args[0]
            current_pos[1] += args[1]
        
        # This is enough to find the start of our c14 segment
        # In the original string: ...c28.1,22.4c14,0,540,0,540,0...
        # The segment 'c14,0,540,0,540,0' starts after 'c28.1,22.4'
        # I'll find where that is.
        pass

# Original Barcelona Path Data:
path = "M727.9,128.8c-7-2.4-64.1-22-72.9-24.6c-8.8-2.6-22.8,0-30.3,8.3c-7.5,8.3-10.1,23.3-4.8,36c5.3,12.7,24.6,16.2,33.4,19.3c8.8,3.1,25.5,9.2,32.9,27.7c7.5,18.4,7.5,34.2,0.9,41.3c-6.6,7-15.8,6.6-25,1.8S460,117.2,436.4,104.3c-19.3-10.5-47.9,1.8-54,11c-4.5,6.8-48.3,68.5-56.2,79.9c-7.9,11.4-9.2,24.6-9.2,29c0,4.4,0,10.1,0,15.4c0,15.8-14.9,19.8-23.7,19.8c-8.8,0-16.7,0-47.9,0S186.1,239,180,235.1c-6.1-4-42.1-28.5-47.4-31.6c-5.3-3.1-12.3-6.1-12.3-18.9c0-13.6,11-18,19.8-18c8.8,0,63.7,0,91.8,0c25.9,0,55.8-18.9,55.8-50c0-16.7-16.7-26.8-29.4-26.8c-10.1,0-96.1,0-127.3,0c-22.4,0-52.9,10.9-70.7,27.7c-14.9,14-22.8,32.9-22.8,46.1c0,29,15.4,45.7,25,51.4c9.7,5.7,33.8,14.5,52.7,22.4c18.9,7.9,18,26.8,18,42.1c0,16.2,11.4,22.4,28.1,22.4c14,0,540,0,540,0c45.2,0,55.8-29.4,55.8-44.3c0-14.9,0-37.3,0-42.6c0,0,0-33.1,0-44.1S751.3,136.7,727.9,128.8z"

# Let's find segments
parts = re.split(r'([McSzs])', path)
# Part before c14,0,540:
# c0,16.2,11.4,22.4,28.1,22.4
# c14,0,540,0,540,0 -> the straight
