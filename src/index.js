import * as demo from "./main"
import * as dev from "./box"
import r from "ramda"
import box from "./box"
import bitbox from "bitbox"
import * as b from "bitbox"
import inferno from "inferno"
import createElement from "inferno-create-element"
import h from "inferno-hyperscript"

Object.assign(window, { b, demo, dev, box, bitbox, inferno, r, createElement, h })
