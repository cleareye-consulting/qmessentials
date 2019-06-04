@extends('layouts/app')

@section('title','Edit Metric')

@section('content')    
    <div class="container">
    <h2 class="subtitle">View Metric</h2>  
    <form class="form">
        <div class="form-group">
            <label class="control-label" for="metric_name">Name</label>
            <input class="form-control" type="text" id="metric_name" name="metric_name" placeholder="Name" value="{{$metric->metric_name}}" disabled/>
        </div>
        <div class="form-group">        
            <div class="form-check">
                <input class="form-check-input" type="checkbox" id="has_multiple_results" name="has_multiple_results" {{$metric->has_multiple_results ? 'checked="checked"' : ''}}  disabled>
                <label class="form-check-label" for="has_multiple_results">
                    Has Multiple Results
                </label>
            </div>
        </div>
        <div class="form-group">
            <label class="control-label" for="available_qualifiers">Available Qualifiers</label>
            <input class="form-control" type="text" id="available_qualifiers" name="available_qualifiers" value="{{implode(' ', $metric->available_qualifiers)}}"  disabled/>
        </div>
        <div class="form-group">
            <label class="control-label" for="available_units">Available Units</label>
            <input class="form-control" type="text" id="available_units" name="available_units" value="{{implode(' ', $metric->available_units)}}"  disabled/>
        </div>
        <div class="form-group">
            <label class="control-label" for="industry_standards">Industry Standards</label>
            <textarea class="form-control" type="text" id="industry_standards" name="industry_standards" disabled>{{implode("\n", $metric->industry_standards)}}</textarea>
        </div>     
        <div class="form-group">
            <label class="control-label" for="methodology_references" disabled>Methodology References</label>
            <textarea class="form-control" type="text" id="methodology_references" name="methodology_references" disabled>{{implode("\n", $metric->methodology_references)}}</textarea>
        </div>      
        <div class="form-group">        
            <div class="form-check">
                <input class="form-check-input" type="checkbox" id="is_active" name="is_active" {{$metric->is_active ? 'checked="checked"' : ''}} disabled>
                <label class="form-check-label" for="is_active">
                    Active
                </label>
            </div>
        </div>
    </form>
    </div>
@endsection