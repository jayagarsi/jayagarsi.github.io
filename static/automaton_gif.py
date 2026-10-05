import matplotlib.pyplot as plt
import matplotlib.animation as animation
import networkx as nx

# --- Define the DFA for a(b|c)*d ---
states = ["q0", "q1", "q2"]
accepting = {"q2"}
start = "q0"
transitions = {
    ("q0", "a"): "q1",
    ("q1", "b"): "q1",
    ("q1", "c"): "q1",
    ("q1", "d"): "q2",
}
input_string = "abcbcd"

# Fixed positions so the layout doesn't jitter between frames
pos = {"q0": (0, 0), "q1": (1, 0), "q2": (2, 0)}

G = nx.MultiDiGraph()
G.add_nodes_from(states)
for (src, sym), dst in transitions.items():
    G.add_edge(src, dst, label=sym)

# Colors matching the site's amber/copper theme
BG = "#0d1117"
NODE_DEFAULT = "#161b22"
NODE_BORDER = "#8b949e"
NODE_CURRENT = "#e3a857"
NODE_ACCEPT_BORDER = "#4ecdc4"
TEXT = "#e6e6e6"
EDGE_COLOR = "#8b949e"

# Precompute the sequence of states as input is consumed
state_sequence = [start]
current = start
for ch in input_string:
    current = transitions.get((current, ch))
    state_sequence.append(current)

fig, ax = plt.subplots(figsize=(7, 3.2), dpi=150)
fig.patch.set_facecolor(BG)


def draw_frame(frame_idx):
    ax.clear()
    ax.set_facecolor(BG)
    ax.set_xlim(-0.6, 2.8)
    ax.set_ylim(-1.2, 1.2)
    ax.axis("off")

    current_state = state_sequence[frame_idx]
    consumed = input_string[:frame_idx]
    remaining = input_string[frame_idx:]

    # Draw edges with curvature for self-loops / parallel edges
    for (src, dst, data) in G.edges(data=True):
        x1, y1 = pos[src]
        x2, y2 = pos[dst]
        if src == dst:
            circle = plt.Circle((x1, y1 + 0.45), 0.22, fill=False,
                                 color=EDGE_COLOR, linewidth=1.3)
            ax.add_patch(circle)
            ax.annotate(data["label"], (x1, y1 + 0.75), color=TEXT,
                        fontsize=9, ha="center", family="monospace")
        else:
            ax.annotate("", xy=(x2 - 0.22, y2), xytext=(x1 + 0.22, y1),
                        arrowprops=dict(arrowstyle="->", color=EDGE_COLOR, lw=1.3))
            mx, my = (x1 + x2) / 2, (y1 + y2) / 2 + 0.18
            ax.annotate(data["label"], (mx, my), color=TEXT,
                        fontsize=9, ha="center", family="monospace")

    # Draw nodes
    for s in states:
        x, y = pos[s]
        is_current = (s == current_state)
        is_accept = s in accepting
        face = NODE_CURRENT if is_current else NODE_DEFAULT
        edge = NODE_ACCEPT_BORDER if is_accept else NODE_BORDER
        lw = 3 if is_accept else 1.5
        circle = plt.Circle((x, y), 0.22, facecolor=face, edgecolor=edge,
                             linewidth=lw, zorder=3)
        ax.add_patch(circle)
        ax.annotate(s, (x, y), color=TEXT if not is_current else BG,
                    fontsize=10, ha="center", va="center", zorder=4,
                    family="monospace", fontweight="bold")

    # Input track at the bottom
    track_y = -0.9
    start_x = 0.5
    for i, ch in enumerate(input_string):
        cx = start_x + i * 0.3
        if i < frame_idx:
            color, bg = TEXT, "#1f2630"
        elif i == frame_idx:
            color, bg = BG, NODE_CURRENT
        else:
            color, bg = "#5b6470", BG
        ax.add_patch(plt.Rectangle((cx - 0.13, track_y - 0.13), 0.26, 0.26,
                                    facecolor=bg, edgecolor=EDGE_COLOR, linewidth=0.8))
        ax.annotate(ch, (cx, track_y), color=color, fontsize=9,
                    ha="center", va="center", family="monospace", fontweight="bold")

    # Status text
    if frame_idx == len(input_string):
        accepted = current_state in accepting
        status = "Accepted ✓" if accepted else "Rejected ✗"
        status_color = NODE_ACCEPT_BORDER if accepted else "#ff6b6b"
    else:
        status = f"reading '{input_string[frame_idx]}'"
        status_color = TEXT
    ax.annotate(status, (1.1, 0.95), color=status_color, fontsize=10,
                ha="center", family="monospace")


frames = len(state_sequence)
anim = animation.FuncAnimation(fig, draw_frame, frames=frames, interval=900, repeat=True)

anim.save("/home/claude/automaton-demo.gif", writer="pillow", fps=1.1)
print("done")
