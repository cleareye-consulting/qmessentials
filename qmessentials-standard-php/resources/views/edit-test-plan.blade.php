@extends('layouts/app')

@section('title','Edit Test Plan')

@section('content')    
    <div class="container">
    <h2 class="subtitle">Edit Test Plan</h2>  
    <form class="form" action="/test-plans/{{$test_plan->test_plan_id}}" method="POST">
        {{csrf_field()}}
        <input type="hidden" id="test_plan_id" name="test_plan_id" value="{{$test_plan->test_plan_id}}"/>
        <input type="hidden" name="_method" value="PUT">
        <input type="hidden" name="test_plan_metric_id_under_edit" value="{{$test_plan_metric_id_under_edit}}"/>
        <input type="hidden" name="is_active_original_value" id="is_active_original_value" value="{{$test_plan->is_active}}"/>
        <div class="form-group">
            <label class="control-label" for="test_plan_name">Name</label>
            <input class="form-control" type="text" id="test_plan_name" name="test_plan_name" placeholder="Name" value="{{$test_plan->test_plan_name}}" disabled/>
        </div>
        <div class="form-group">        
            <div class="form-check">
                <input class="form-check-input" type="checkbox" id="is_active" name="is_active" {{$test_plan->is_active ? 'checked="checked"' : ''}}>
                <label class="form-check-label" for="is_active">
                    Active
                </label>
            </div>
        </div>
        <table class="table">
            <thead>
                <tr>
                    <th width="10%">Order</th>
                    <th width="18%">Metric Name</th>
                    <th width="16%">Qualifier</th>                    
                    <th width="15%">Usage</th>
                    <th width="11%">Criteria</th>
                    <th width="16">Units</th>
                    <th width="5%">Nullable</th>                    
                    <th width="4%">Active</th>
                    <th width="5%">&nbsp;</th>
                </tr>
            </thead>
            <tbody>
            @foreach($test_plan_metrics as $test_plan_metric)
                @if ($test_plan_metric->test_plan_metric_id == $test_plan_metric_id_under_edit)
                <tr>
                    <td><input type="text" class="form-control" id="edited_metric_sort_order" name="edited_metric_sort_order" value="{{$test_plan_metric->sort_order}}"/></td>
                    <td>{{$test_plan_metric->metric_name}}</td>
                    <td>
                        <select class="form-control" id="edited_metric_qualifier" name="edited_metric_qualifier">
                        @foreach($available_qualifiers_for_edit as $qualifier)
                            <option {{$qualifier == $test_plan_metric->qualifier ? 'selected' : ''}}>{{$qualifier}}</option>
                        @endforeach
                        </select>
                    </td>
                    <td>
                        <input class="form-control" name="edited_metric_usage_code" id="edited_metric_usage_code" list="usageCodes" value="{{$test_plan_metric->usage_code}}"/> 
                        <datalist id="usageCodes">
                            <option>Any</option>
                            <option>All</option>
                            <option>B</option>
                            <option>E</option>
                            <option>BE</option>
                            <option>B2E</option>
                            <option>B3E</option>
                            <option>B5E</option>
                            <option>1/L</option>
                        </datalist>
                    </td>
                    <td><input type="text" class="form-control" id="edited_metric_criteria" name="edited_metric_criteria" value="{{$test_plan_metric->criteria}}"/></td>
                    <td>
                        <select class="form-control" id="edited_metric_unit" name="edited_metric_unit">
                        @foreach($available_units_for_edit as $unit)
                            <option {{$unit == $test_plan_metric->unit ? 'selected' : ''}}>{{$unit}}</option>
                        @endforeach
                        </select>
                    </td>
                    <td><input type="checkbox" id="edited_metric_is_nullable" name="edited_metric_is_nullable" {{$test_plan_metric->is_nullable ? 'checked' : ''}}/></td>
                    <td><input type="checkbox" id="edited_metric_is_active" name="edited_metric_is_active" {{$test_plan_metric->is_active ? 'checked' : ''}}/></td>
                    <td><button class="btn btn-small btn-default">Update</button></td>
                </tr>
                @else
                <tr>
                    <td data-fieldname="sort_order">{{$test_plan_metric->sort_order}}</td>
                    <td>{{$test_plan_metric->metric_name}}</td>
                    <td>{{$test_plan_metric->qualifier}}</td>
                    <td>{{$test_plan_metric->usage_code}}</td>
                    <td>{{$test_plan_metric->criteria}}</td>
                    <td>{{$test_plan_metric->unit}}</td>
                    <td>{{$test_plan_metric->is_nullable ? 'Y' : 'N'}}</td>
                    <td>{{$test_plan_metric->is_active ? 'Y' : 'N'}}</td>
                    <td><a class="btn btn-small btn-default" href="/test-plans/{{$test_plan_metric->test_plan_id}}/edit/{{$test_plan_metric->test_plan_metric_id}}">Edit</a></td>
                </tr>
                @endif
            @endforeach
            @if(is_null($test_plan_metric_id_under_edit))
                <tr>
                    <td><input type="text" class="form-control" id="new_metric_sort_order" name="new_metric_sort_order"/></td>
                    <td>
                        <select class="form-control" id="new_metric_id" name="new_metric_id">
                            <option value="0">Select a metric...</option>
                        @foreach ($metrics as $metric) 
                            <option value="{{$metric->metric_id}}">{{$metric->metric_name}}</option>
                        @endforeach
                        </select>
                    </td>
                    <td><select class="form-control" id="new_metric_qualifier" name="new_metric_qualifier"></select></td>
                    <td>
                        <input class="form-control" name="new_metric_usage_code" id="new_metric_usage_code" list="usageCodes"/> 
                        <datalist id="usageCodes">
                            <option>Any</option>
                            <option>All</option>
                            <option>B</option>
                            <option>E</option>
                            <option>BE</option>
                            <option>B2E</option>
                            <option>B3E</option>
                            <option>B5E</option>
                            <option>1/L</option>
                        </datalist>
                    </td>
                    <td><input type="text" class="form-control" id="new_metric_criteria" name="new_metric_criteria"/></td>
                    <td><select class="form-control" id="new_metric_unit" name="new_metric_unit"></select></td>
                    <td><input type="checkbox" id="new_metric_is_nullable" name="new_metric_is_nullable"/></td>
                    <td><input type="checkbox" id="new_metric_is_active" name="new_metric_is_active" checked/></td>
                    <td><button class="btn btn-small btn-default">Add</button></td>
                </tr>
                @endif
            </tbody>
        </table>
        <div class="form-group">
            <button class="btn btn-primary" id="submitButton" disabled>Save Changes</button>
            <a class="btn btn-default" href="/test-plans">Return to List</a>
        </div>
    </form>
    </div>
@endsection

@section('scripts')
    <script src="https://code.jquery.com/jquery-3.4.1.min.js" integrity="sha256-CSXorXvZcTkaix6Yvo6HppcZGetbYMGWSFlBw8HfCJo=" crossorigin="anonymous"></script>
    <script>
        $(() => {
            $('#new_metric_id').change(async () => {
                $('#new_metric_qualifier').empty();
                $('#new_metric_units').empty();
                try {
                    var qualifiers = await $.get('/api/available-qualifiers/' + $('#new_metric_id').val());
                    var units = await $.get('/api/available-units/' + $('#new_metric_id').val());
                    $('<option/>').val('').text('').appendTo($('#new_metric_qualifier'));
                    $.each(qualifiers, q => $('<option/>').val(qualifiers[q]).text(qualifiers[q]).appendTo($('#new_metric_qualifier')));
                    $('<option/>').val('').text('').appendTo($('#new_metric_unit'));
                    $.each(units, u => $('<option/>').val(units[u]).text(units[u]).appendTo($('#new_metric_unit')));                                        
                }
                catch (error) {
                    console.error(error);
                }
                if (!($('#new_metric_sort_order').val())) {
                    const existingValues = $.map($('td[data-fieldname="sort_order"]'), td => $(td).html());
                    const newValue = existingValues.length === 0 ? 1 : Math.max(...existingValues) + 1;
                    $('#new_metric_sort_order').val(newValue);
                }
            });
            $('#is_active').click(() => {                
                $('#submitButton').prop('disabled', $('#is_active').is('checked') === $('#is_active_original_value').val());
            });            
        });
    </script>
@endsection