export interface FunctionDescription {
  type: "function";
  label: string;
  detail: string;
  apply: string;
}

export const FUNCTIONS: FunctionDescription[] = [
  // State functions
  {
    type: "function",
    label: "states",
    detail: "states(entity_id, rounded=False, with_unit=False)",
    apply: "states('', False, False)",
  },
  {
    type: "function",
    label: "state_attr",
    detail: "state_attr(entity_id, attribute)",
    apply: "state_attr('', '')",
  },
  {
    type: "function",
    label: "is_state",
    detail: "is_state(entity_id, state)",
    apply: "is_state('', '')",
  },
  {
    type: "function",
    label: "is_state_attr",
    detail: "is_state_attr(entity_id, attribute, value)",
    apply: "is_state_attr('', '', '')",
  },
  {
    type: "function",
    label: "has_value",
    detail: "has_value(entity_id)",
    apply: "has_value('')",
  },

  // Entity selection functions
  {
    type: "function",
    label: "area_entities",
    detail: "area_entities(area_id)",
    apply: "area_entities('')",
  },
  {
    type: "function",
    label: "device_entities",
    detail: "device_entities(device_id)",
    apply: "device_entities('')",
  },
  {
    type: "function",
    label: "label_entities",
    detail: "label_entities(label)",
    apply: "label_entities('')",
  },
  {
    type: "function",
    label: "integration_entities",
    detail: "integration_entities(domain)",
    apply: "integration_entities('')",
  },
  {
    type: "function",
    label: "expand",
    detail: "expand(entity_ids)",
    apply: "expand('')",
  },
  {
    type: "function",
    label: "areas",
    detail: "areas(area_id=None)",
    apply: "areas()",
  },
  {
    type: "function",
    label: "area_id",
    detail: "area_id(entity_id)",
    apply: "area_id('')",
  },
  {
    type: "function",
    label: "area_name",
    detail: "area_name(entity_id)",
    apply: "area_name('')",
  },
  {
    type: "function",
    label: "devices",
    detail: "devices(area_id=None)",
    apply: "devices()",
  },
  {
    type: "function",
    label: "device_id",
    detail: "device_id(entity_id)",
    apply: "device_id('')",
  },
  {
    type: "function",
    label: "device_attr",
    detail: "device_attr(entity_id, attribute)",
    apply: "device_attr('', '')",
  },
  {
    type: "function",
    label: "config_entries",
    detail: "config_entries(domain=None)",
    apply: "config_entries()",
  },
  {
    type: "function",
    label: "floors",
    detail: "floors(floor_id=None)",
    apply: "floors()",
  },
  {
    type: "function",
    label: "floor_id",
    detail: "floor_id(area_id)",
    apply: "floor_id('')",
  },
  {
    type: "function",
    label: "floor_name",
    detail: "floor_name(area_id)",
    apply: "floor_name('')",
  },
  {
    type: "function",
    label: "labels",
    detail: "labels(label=None)",
    apply: "labels()",
  },

  // Time functions
  {
    type: "function",
    label: "now",
    detail: "now()",
    apply: "now()",
  },
  {
    type: "function",
    label: "utcnow",
    detail: "utcnow()",
    apply: "utcnow()",
  },
  {
    type: "function",
    label: "today_at",
    detail: "today_at(time)",
    apply: "today_at('')",
  },
  {
    type: "function",
    label: "as_timestamp",
    detail: "as_timestamp(datetime)",
    apply: "as_timestamp('')",
  },
  {
    type: "function",
    label: "as_datetime",
    detail: "as_datetime(timestamp)",
    apply: "as_datetime('')",
  },
  {
    type: "function",
    label: "relative_time",
    detail: "relative_time(datetime)",
    apply: "relative_time('')",
  },
  {
    type: "function",
    label: "strptime",
    detail: "strptime(string, format)",
    apply: "strptime('', '')",
  },
  {
    type: "function",
    label: "strftime",
    detail: "strftime(datetime, format)",
    apply: "strftime('', '')",
  },

  // Utility functions
  {
    type: "function",
    label: "distance",
    detail: "distance(lat1, lon1, lat2, lon2)",
    apply: "distance('', '', '', '')",
  },
  {
    type: "function",
    label: "closest",
    detail: "closest(latitude, longitude, entities)",
    apply: "closest('', '', '')",
  },
  {
    type: "function",
    label: "slugify",
    detail: "slugify(text)",
    apply: "slugify('')",
  },
  {
    type: "function",
    label: "log",
    detail: "log(message, level)",
    apply: "log('', '')",
  },

  // Mathematical functions
  {
    type: "function",
    label: "sin",
    detail: "sin(value)",
    apply: "sin('')",
  },
  {
    type: "function",
    label: "cos",
    detail: "cos(value)",
    apply: "cos('')",
  },
  {
    type: "function",
    label: "tan",
    detail: "tan(value)",
    apply: "tan('')",
  },
  {
    type: "function",
    label: "sqrt",
    detail: "sqrt(value)",
    apply: "sqrt('')",
  },
  {
    type: "function",
    label: "e",
    detail: "e",
    apply: "e",
  },
  {
    type: "function",
    label: "pi",
    detail: "pi",
    apply: "pi",
  },
  {
    type: "function",
    label: "tau",
    detail: "tau",
    apply: "tau",
  },

  // Data type functions
  {
    type: "function",
    label: "float",
    detail: "float(value, default=None)",
    apply: "float('', None)",
  },
  {
    type: "function",
    label: "int",
    detail: "int(value, default=None, base=10)",
    apply: "int('', None, 10)",
  },
  {
    type: "function",
    label: "bool",
    detail: "bool(value)",
    apply: "bool('')",
  },

  // JSON functions
  {
    type: "function",
    label: "from_json",
    detail: "from_json(json_string)",
    apply: "from_json('')",
  },
  {
    type: "function",
    label: "to_json",
    detail: "to_json(object, sort_keys=False)",
    apply: "to_json('', False)",
  },

  // Type checking functions
  {
    type: "function",
    label: "is_number",
    detail: "is_number(value)",
    apply: "is_number('')",
  },
  {
    type: "function",
    label: "is_defined",
    detail: "is_defined(value)",
    apply: "is_defined('')",
  },
  {
    type: "function",
    label: "typeof",
    detail: "typeof(value)",
    apply: "typeof('')",
  },

  // String processing functions
  {
    type: "function",
    label: "regex_search",
    detail: "regex_search(pattern, string)",
    apply: "regex_search('', '')",
  },
  {
    type: "function",
    label: "regex_match",
    detail: "regex_match(pattern, string)",
    apply: "regex_match('', '')",
  },
  {
    type: "function",
    label: "regex_replace",
    detail: "regex_replace(pattern, replacement, string)",
    apply: "regex_replace('', '', '')",
  },
  {
    type: "function",
    label: "regex_findall",
    detail: "regex_findall(pattern, string)",
    apply: "regex_findall('', '')",
  },

  // Conditional functions
  {
    type: "function",
    label: "iif",
    detail: "iif(condition, if_true, if_false)",
    apply: "iif('', '', '')",
  },

  // State translation functions
  {
    type: "function",
    label: "state_translated",
    detail: "state_translated(entity_id)",
    apply: "state_translated('')",
  },

  // System functions
  {
    type: "function",
    label: "version",
    detail: "version()",
    apply: "version()",
  },
  {
    type: "function",
    label: "merge",
    detail: "merge(dict1, dict2, ...)",
    apply: "merge('', '', '')",
  },

  // List processing functions
  {
    type: "function",
    label: "flatten",
    detail: "flatten(list)",
    apply: "flatten('')",
  },

  // Binary data functions
  {
    type: "function",
    label: "pack",
    detail: "pack(value, format)",
    apply: "pack('', '')",
  },
  {
    type: "function",
    label: "unpack",
    detail: "unpack(data, format)",
    apply: "unpack('', '')",
  },
];
