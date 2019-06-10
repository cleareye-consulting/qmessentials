@extends('layouts/app')

@section('title','View Metric')

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
                <input class="form-check-input" type="checkbox" id="has_multiple_results" name="has_multiple_results" {{$metric->has_multiple_results ? 'checked="checked"' : ''}} disabled>
                <label class="form-check-label" for="has_multiple_results">
                    Has Multiple Results
                </label>
            </div>
        </div>
        <div class="form-group">
            <label class="control-label" for="available_qualifiers">Available Qualifiers</label>
            <input class="form-control" type="text" id="available_qualifiers" name="available_qualifiers" value="{{implode(' ', $metric->metricAvailableQualifiers()->get()->map(function($maq) {return $maq->qualifier;})->toArray())}}" disabled/>
        </div>
        <div class="form-group">
            <label class="control-label" for="available_units">Available Units</label>
            <input class="form-control" type="text" id="available_units" name="available_units" value="{{implode(' ', $metric->metricAvailableUnits()->get()->map(function($mau) {return $mau->unit;})->toArray())}}" disabled/>
        </div>
        <div class="form-group">
            <label class="control-label" for="industry_standards">Industry Standards</label>
            <textarea class="form-control" type="text" id="industry_standards" name="industry_standards" disabled>{{implode("\n", $metric->metricIndustryStandards()->get()->map(function($mis) {return $mis->industry_standard;})->toArray())}}</textarea>
        </div>     
        <div class="form-group">
            <label class="control-label" for="methodology_references">Methodology References</label>
            <textarea class="form-control" type="text" id="methodology_references" name="methodology_references" disabled>{{implode("\n", $metric->metricMethodologyReferences()->get()->map(function($mmr) {return $mmr->methodology_reference;})->toArray())}}</textarea>
        </div>      
    </form>
    </div>
@endsection