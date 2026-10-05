import operator
import os
from typing import TypedDict, Annotated

from dotenv import load_dotenv
from langgraph.graph import StateGraph, END
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import ToolMessage

load_dotenv()
from api.agent.tools import tools

# State definition
class AgentState(TypedDict):
    messages: Annotated[list, operator.add]
    trace: Annotated[list, operator.add]


# LLM with tools bound using active Gemini model
model = ChatGoogleGenerativeAI(
    model="models/gemini-3.8-flash",
    google_api_key=os.getenv("GEMINI_API_KEY")
).bind_tools(tools)


async def agent_node(state: AgentState):
    """Agent decision node: LLM decides which tool to call next."""
    response = await model.ainvoke(state["messages"])
    return {"messages": [response]}


async def tool_node(state: AgentState):
    """Tool execution node: runs the tool the agent selected."""
    last_msg = state["messages"][-1]
    tool_calls = last_msg.tool_calls or []
    new_messages = []
    new_trace = []

    for call in tool_calls:
        tool_fn = next(t for t in tools if t.name == call["name"])
        result = await tool_fn.ainvoke(call["args"])
        new_messages.append(ToolMessage(content=result, tool_call_id=call["id"]))
        new_trace.append({
            "tool": call["name"],
            "input": call["args"],
            "output": str(result)[:200]
        })

    return {"messages": new_messages, "trace": new_trace}


def should_continue(state: AgentState):
    """Conditional edge: continue to tools or end."""
    last_msg = state["messages"][-1]
    return "tools" if last_msg.tool_calls else END


# Build the graph
builder = StateGraph(AgentState)
builder.add_node("agent", agent_node)
builder.add_node("tools", tool_node)
builder.add_edge("__start__", "agent")
builder.add_conditional_edges("agent", should_continue)
builder.add_edge("tools", "agent")

graph = builder.compile()