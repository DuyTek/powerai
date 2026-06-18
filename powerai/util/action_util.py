import json
from typing import List, Dict, Any, Optional, Union
from dataclasses import dataclass


@dataclass
class Element:
    """Represents a simplified DOM element with key properties."""

    tag: str
    id: Optional[str]
    xpath: str
    relativeXpath: str
    elementClass: Optional[str] = None
    type: Optional[str] = None
    tabIndex: Optional[int] = None
    cssSelector: Optional[str] = None


def map_to_element(interacted_element: Dict[str, Any]) -> Element:
    """Maps a single action dictionary to an Element object."""
    attributes = interacted_element.attributes

    if attributes is None:
        return
    # HTML attributes
    element_id = attributes.get('id', None)
    element_class = attributes.get('class', None)
    element_type = attributes.get('type', None)

    relative_xpath = ""
    if element_id:
        relative_xpath = f"//*[@id='{element_id}']"

    # DOMHistoryElement of browser-use is not subscriptable
    tag = interacted_element.tag_name
    tab_index = interacted_element.highlight_index
    css_selector = interacted_element.css_selector
    xpath = interacted_element.xpath

    element = Element(
        tag=tag,
        id=element_id,
        xpath=xpath,
        relativeXpath=relative_xpath,
        elementClass=element_class,
        type=element_type,
        tabIndex=tab_index,
        cssSelector=css_selector
    )
    return element


def map_actions_to_elements(actions: List[Dict[str, Any]]) -> List[Element]:
    """Maps a list of action dictionaries to a list of Element objects."""
    elements = []
    for action in actions:
        interacted_element = action['interacted_element']
        if interacted_element is None:
            break

        elements.append(map_to_element(interacted_element))
    return elements
