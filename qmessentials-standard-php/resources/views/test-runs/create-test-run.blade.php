@extends('layouts/app')

@section('title','Create Test Run')

@section('content')    
    <div class="container">
    <h2 class="subtitle">Create Test Run</h2>  
    <form class="form" action="/test-runs" method="POST">
        {{csrf_field()}}
        <div class="form-group">
            <label class="control-label" for="lot_id">Lot Number</label>
            <select class="form-control" id="lot_id" name="lot_id">
                <option value="0">Select a Lot...</option>
                @foreach($lots as $lot)
                <option value="{{$lot->lot_id}}">{{$lot->lot_number}}</option>
                @endforeach                
            </select>
        </div>
        <div class="form-group">
            <label class="control-label" for="item_id">Item Number</label>
            <select class="form-control" id="item_id" name="item_id"></select>
        </div>      
        <div class="form-group">
            <label class="control-label" for="test_plan_id">Test Plan</label>
            <select class="form-control" name="test_plan_id" id="test_plan_id"></select>
        </div>
        <div class="form-group">
            <button class="btn btn-primary">Create Test Run</button>
            <a class="btn btn-outline-primary" href="/test-runs">Cancel</a>
        </div>
    </form>
    </div>
@endsection

@section('scripts')
    <script src="https://code.jquery.com/jquery-3.4.1.min.js" integrity="sha256-CSXorXvZcTkaix6Yvo6HppcZGetbYMGWSFlBw8HfCJo=" crossorigin="anonymous"></script>
    <script>
        $(() => {            
            $('#lot_id').change(async () => {                
                $('#item_id').empty();
                $('#test_plan_id').empty();
                if ($('#lot_id').val() === 0) {
                    return;
                }
                try {
                    const items = await $.getJSON('/api/items-for-lot/' + $('#lot_id').val());
                    $('<option/>').val(0).text('Select an Item...').appendTo($('#item_id'));
                    for(item of items) {
                        $('<option/>').val(item.item_id).text(item.item_number).appendTo($('#item_id'));
                    }
                }
                catch (error) {
                    console.error(error);
                }
            });
            $('#item_id').change(async () => {
                $('#test_plan_id').empty();
                if ($('#item_id').val() === 0) {
                    return;
                }
                try {
                    var testPlans = await $.getJSON('/api/test-plans-for-item/' + $('#item_id').val());
                    $('<option/>').val(0).text('Select a Test Plan...').appendTo($('#test_plan_id'));
                    for(testPlan of testPlans) {
                        $('<option/>').val(testPlan.test_plan_id).text(testPlan.test_plan_name).appendTo($('#test_plan_id'));
                    }
                }
                catch (error) {
                    console.error(error);
                }
            });
        });
    </script>
@endsection